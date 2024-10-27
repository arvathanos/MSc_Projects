import matplotlib.pyplot as plt
import numpy as np
from pyclustering.cluster.kmeans import kmeans 
from pyclustering.cluster.elbow import elbow
from pyclustering.cluster.center_initializer import kmeans_plusplus_initializer
from pyclustering.utils.metric import distance_metric, type_metric
import pandas as pd
import os
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense,Dropout, Masking




FIGURES_PATH = "figures"
os.makedirs(FIGURES_PATH,exist_ok=True)
datafolder = "datafiles"
os.makedirs(datafolder,exist_ok=True)
dataset = np.load(r"C:\Users\arvan\Desktop\pattern recognition\datafiles\Dataset.npy")
spliter = lambda s: s.split(",")
dataset = np.array([spliter(x) for x in dataset])


pickle_file = os.path.join(datafolder,"dataframe.pkl")
if os.path.exists(pickle_file):
    dataframe = pd.read_pickle(pickle_file)
else:
    dataframe = pd.DataFrame(dataset, columns=["user","item","rating","date"])
    dataframe["user"] = dataframe["user"].apply(lambda s:np.int64(s.replace("ur","")))
    dataframe["item"] = dataframe["item"].apply(lambda s:np.int64(s.replace("tt","")))
    dataframe["rating"] = dataframe["rating"].apply(lambda s:np.int64(s))
    dataframe["date"] = pd.to_datetime(dataframe["date"])
    dataframe.to_pickle(pickle_file)
    
    
    
def plot_histogram(series, title_str):
    n, bins, patches = plt.hist(series, bins='auto', color='red',
                                alpha=0.7, rwidth=0.75)
    plt.grid(axis='y', alpha=0.75)
    plt.xlabel(series.name)
    plt.ylabel('Frequency')
    plt.title(title_str)
    maxfreq = n.max()
    plt.ylim(ymax=np.ceil(maxfreq / 10) * 10 if maxfreq % 10 else maxfreq + 10)
    filename = series.name + ".png"
    figure_url = os.path.join(FIGURES_PATH, filename)
    plt.savefig(figure_url, dpi=100, format='png', bbox_inches='tight')
    plt.show()
        
    
#====================== q1 ================== Unique entities ==============# 

#unique users
users = dataframe["user"].unique()
users_num = len(users)

#unique Movies
items = dataframe["item"].unique()
items_num = len(items)
ratings_num = dataframe.shape[0]


print("INITIAL DATASET: {0} number of unique users and {1} of unique items".format(users_num,items_num))

print("INITIAL DATASET: {} total number of existing ratings".format(ratings_num))


#---------------------------Q3, Part 1--------------------------------#

#Ratings number for each user
pickle_file = os.path.join(datafolder,"ratings_num_df.pkl")
if os.path.exists(pickle_file):
    ratings_num_df = pd.read_pickle(pickle_file)
else:
    ratings_num_df =  dataframe.groupby("user")["rating"].count().sort_values(ascending=
                                    False).reset_index(name="ratings_num")
    ratings_num_df.to_pickle(pickle_file)

#Ratings's timeframe for each user
pickle_file = os.path.join(datafolder,"ratings_span_df.pkl")
if os.path.exists(pickle_file):
    ratings_span_df = pd.read_pickle(pickle_file)
else:
    ratings_span_df = dataframe.groupby("user")["date"].apply(lambda date: 
    max(date)-min(date)).sort_values(ascending=False).reset_index(name="ratings_span")
    ratings_span_df.to_pickle(pickle_file)



#Table with ratings's number and timespan
ratings_df = ratings_num_df.join(ratings_span_df.set_index('user'),on='user')
ratings_df["ratings_span"] = ratings_df["ratings_span"].dt.days



# =============== Q2 ========================== Sub-clusters =================#

minimum_ratings = 100
maximum_ratings = 300
reduced_ratings_df = ratings_df.loc[(ratings_df["ratings_num"] >= minimum_ratings) & 
                                    (ratings_df["ratings_num"] <= maximum_ratings)]

final_df = dataframe.loc[dataframe["user"].isin(reduced_ratings_df["user"])].reset_index()
final_df = final_df.drop("index",axis=1)



final_users = final_df["user"].unique()
final_items = final_df["item"].unique()
final_users_num = len(final_users)
final_items_num = len(final_items)
final_ratings_num = len(final_df)

print("REDUCED DATASET: {0} number of unique users and {1} of unique items".format(final_users_num,final_items_num))
print("REDUCED DATASET: {} total number of existing ratings".format(final_ratings_num))

sorted_final_users = np.sort(final_users)
sorted_final_items = np.sort(final_items)

#ορισμός των νέων index
final_users_dict = dict(zip(sorted_final_users,list(range(0,final_users_num))))
final_items_dict = dict(zip(sorted_final_items,list(range(0,final_items_num))))
final_df["user"] = final_df["user"].map(final_users_dict)
final_df["item"] = final_df["item"].map(final_items_dict)
users_group_df = final_df.groupby("user")

#  =============================== Q3 ======================================#

plot_histogram(reduced_ratings_df["ratings_num"],"Number of Ratings per User")
plot_histogram(reduced_ratings_df["ratings_span"],"Time Span of Ratings per User")



#=============================== Q4 ========================================#
# ------------------------CREATING THE SPARSE MATRIX------------------------- #

unique_movies, num_movies = np.unique(final_df['item'], return_counts=True)

num_movies_array = pd.DataFrame({'MovieID': unique_movies, 'Count': num_movies})
ratings = final_df['rating'].astype(float)

maxUser = final_df['user'].max()
maxMovie = final_df['item'].max()

userMovieRatings2 = np.zeros((maxUser, maxMovie))

for index, row in final_df.iterrows():
    userMovieRatings2[row['user'] - 1, row['item'] - 1] = row['rating']



#=======================  Phase 2 ============================================#

def custom_distance(x, y):
    
    non_zero_idx = np.logical_and(x != 0, y != 0)
    if np.any(non_zero_idx):
        
        return np.linalg.norm(x[non_zero_idx] - y[non_zero_idx])
    
    else:
        return float('inf')
   
def custom_distance2(x, y):
    non_zero_idx = np.logical_and(x != 0, y != 0)
    if np.any(non_zero_idx):
        
        numerator =np.sum(x[non_zero_idx] * y[non_zero_idx])
        denominator = np.sum(np.linalg.norm((x[non_zero_idx]))) * (np.linalg.norm((y[non_zero_idx])))
        cos = numerator / denominator
        
        return  1 - abs(cos)
    else:
        return 1

    


def custom_distance3(x, y):
     non_zero_idx = np.logical_and(x != 0 , y != 0)
     non_zero_idx_x = (x != 0)
     non_zero_idx_y = (y != 0)
     
     numerator =np.sum(x[non_zero_idx])
     denominator = np.sum(x[non_zero_idx_x]) + np.sum(y[non_zero_idx_y]) - np.sum(x[non_zero_idx])
     fi = numerator / denominator
 
     return  1 - fi

#---------------------------------------PHASE 3-------------------------------#

#---------------Fi(U)-------------------------

L = np.copy(userMovieRatings2)

zero_indices = userMovieRatings2 == 0

nonzero_indices = userMovieRatings2 != 0

L[zero_indices] = 0

L[nonzero_indices] = 1



W_custom_numpy_file = os.path.join(datafolder, "W_custom.npy")  

if os.path.exists(W_custom_numpy_file):
    W_custom = np.load(W_custom_numpy_file, allow_pickle=True)
else:
    W_custom = np.zeros((L.shape[0],L.shape[0]))
    
    for user_idx in range(L.shape[0]):
        # We use range(user_idx, L.shape[0]) to compute only the elements of the matrix above the diagonal.
        for other_user_idx in range(user_idx, L.shape[0]): 
            x = L[user_idx]
            y = L[other_user_idx]
            similarity = custom_distance3(x, y)
            W_custom[user_idx, other_user_idx] = similarity
            W_custom[other_user_idx, user_idx] = similarity 
            
        
    W_custom_numpy_file = os.path.join(datafolder, "W_custom.npy")
    np.save(W_custom_numpy_file, W_custom)

#---------------------------KMEANS INIT---------------------------------------#

custom_metric = distance_metric(type_metric.USER_DEFINED, func=custom_distance)

k=8

# Initialize the initial centers using k-means++ algorithm
initial_centers = kmeans_plusplus_initializer(userMovieRatings2,k).initialize()

# Create a KMeans algorithm instance with custom distance metric
kmeans_instance = kmeans(userMovieRatings2, initial_centers,metric=custom_metric)

# Run the KMeans algorithm
kmeans_instance.process()

# Get the clusters and their centers
labels = kmeans_instance.get_clusters()
centers = kmeans_instance.get_centers()

# Print the results
#print("Clusters:", clusters)
#print("Centers:", centers)

for cluster_index, cluster in enumerate(labels):
    print(f"Cluster {cluster_index + 1}: {len(cluster)} elements")


# create instance of Elbow method using K value from 1 to 10. ELBOW METHOD PLOT
kmin, kmax = 1, 10
elbow_instance = elbow(userMovieRatings2, kmin, kmax)
# process input data and obtain results of analysis
elbow_instance.process()
amount_clusters = elbow_instance.get_amount()   # most probable amount of clusters
wce = elbow_instance.get_wce()                  # total within-cluster errors for each K
plt.plot(range(kmin, kmax + 1), wce, marker='o')
plt.xlabel('Number of clusters (K)')
plt.ylabel('Within-cluster error')
plt.title('Elbow Method 1')
plt.grid(True)
plt.show()


#--------------------------PCA------------------------------------------------#
pca = PCA(n_components=3) 

userMovieRatings2_pca = pca.fit_transform(userMovieRatings2)
# Information about the principal components (summary)
explained_variance_ratio = pca.explained_variance_ratio_
print("Explained variance ratios:", explained_variance_ratio)
print("Total explained variance:", np.sum(explained_variance_ratio))

#-----------------------------------------------------------------------------#


user_cluster_mapping = {}
for cluster_index, cluster in enumerate(labels):
    for user_index in cluster:
        user_cluster_mapping[user_index] = cluster_index 

# Vetrices that store the label of each user
user_labels = [user_cluster_mapping[user_index] for user_index in range(len(userMovieRatings2_pca))]

color_map = {label: plt.cm.tab10(i) for i, label in enumerate(np.unique(user_labels))}

fig = plt.figure()
ax = fig.add_subplot(111,projection='3d')

for label, color in color_map.items():
    indices = np.where(user_labels == label)
    ax.scatter(userMovieRatings2_pca[indices, 0], userMovieRatings2_pca[indices, 1], userMovieRatings2_pca[indices, 2], c=[color], label=f'Group {label}')

# Names for the axis
ax.set_xlabel('Principal Component 1')
ax.set_ylabel('Principal Component 2')
ax.set_zlabel('Principal Component 3')

# Adding appropriate labels for the colors of the groups
ax.legend()

# Plot title
ax.set_title('3D Scatter Plot 1st Metric')

plt.show()

fig = plt.figure(figsize=(10, 8))

# Settings for the subplots
num_rows = 2
num_cols = len(color_map) // num_rows

for i, (label, color) in enumerate(color_map.items(), 1):
    # Creating subplot
    ax = fig.add_subplot(num_rows, num_cols, i, projection='3d')

    # Data selection for each specific label
    indices = np.where(user_labels == label)

    #Subplot
    ax.scatter(userMovieRatings2_pca[indices, 0], userMovieRatings2_pca[indices, 1], userMovieRatings2_pca[indices, 2], c=[color], label=f'Group {label}')

    # Axis
    ax.set_xlabel('Principal Component 1')
    ax.set_ylabel('Principal Component 2')
    ax.set_zlabel('Principal Component 3')
    

    fig.suptitle('Individual 3D Scatter Plots 1st Metric', fontsize=16)

    # Subplot
    ax.set_title(f'Group {label}')


plt.tight_layout()

plt.show()



print("--------------SECOND DISTANCE---------------")

custom_metric2 = distance_metric(type_metric.USER_DEFINED, func=custom_distance2)

k=6

# Initialize the initial centers using k-means++ algorithm
initial_centers = kmeans_plusplus_initializer(userMovieRatings2, k).initialize()

# Create a KMeans algorithm instance with custom distance metric
kmeans_instance2 = kmeans(userMovieRatings2, initial_centers, metric=custom_metric2)

# Run the KMeans algorithm
kmeans_instance2.process()

# Get the clusters and their centers
clusters2 = kmeans_instance2.get_clusters()
centers2 = kmeans_instance2.get_centers()

# Print the results
#print("Clusters:", clusters2)
#print("Centers:", centers2)


for cluster_index, cluster in enumerate(clusters2):
    print(f"Cluster {cluster_index + 1}: {len(cluster)} elements")

# create instance of Elbow method using K value from 1 to 10. ELBOW METHOD PLOT
kmin, kmax = 1, 10
elbow_instance = elbow(userMovieRatings2, kmin, kmax)
# process input data and obtain results of analysis
elbow_instance.process()
amount_clusters = elbow_instance.get_amount()   # most probable amount of clusters
wce = elbow_instance.get_wce()                  # total within-cluster errors for each K
plt.plot(range(kmin, kmax + 1), wce, marker='o')
plt.xlabel('Number of clusters (K)')
plt.ylabel('Within-cluster error')
plt.title('Elbow Method 2')
plt.grid(True)
plt.show()


pca = PCA(n_components=5) 

userMovieRatings2_pca = pca.fit_transform(userMovieRatings2)


labels2  = kmeans_instance2.get_clusters()
centers2 = kmeans_instance2.get_centers()


user_cluster_mapping = {}
for cluster_index, cluster in enumerate(labels2):
    for user_index in cluster:
        user_cluster_mapping[user_index] = cluster_index 

# Vetrices that store the labels of each user
user_labels = [user_cluster_mapping[user_index] for user_index in range(len(userMovieRatings2_pca))]

color_map = {label: plt.cm.tab10(i) for i, label in enumerate(np.unique(user_labels))}

fig = plt.figure()
ax = fig.add_subplot(111,projection='3d')

for label, color in color_map.items():
    indices = np.where(user_labels == label)
    ax.scatter(userMovieRatings2_pca[indices, 0], userMovieRatings2_pca[indices, 1], userMovieRatings2_pca[indices, 2], c=[color], label=f'Group {label}')

# Naming the axis
ax.set_xlabel('Principal Component 1')
ax.set_ylabel('Principal Component 2')
ax.set_zlabel('Principal Component 3')

ax.legend()


ax.set_title('3D Scatter Plot 2nd Metric')

plt.show()

fig = plt.figure(figsize=(10, 8))

# Calculate the number of rows and columns dynamically based on the number of clusters
num_clusters = len(color_map)
num_cols = int(np.ceil(np.sqrt(num_clusters)))
num_rows = int(np.ceil(num_clusters / num_cols))

# Creating the subplots and fitting them in one plot
#num_rows = 2
#num_cols = len(color_map) // num_rows

for i, (label, color) in enumerate(color_map.items(), 1):
    
    ax = fig.add_subplot(num_rows, num_cols, i, projection='3d')

    # Choosing the data for a specific label
    indices = np.where(user_labels == label)

    # Plotting the data in the subplot
    ax.scatter(userMovieRatings2_pca[indices, 0], userMovieRatings2_pca[indices, 1], userMovieRatings2_pca[indices, 2], c=[color], label=f'Group {label}')

    
    ax.set_xlabel('Principal Component 1')
    ax.set_ylabel('Principal Component 2')
    ax.set_zlabel('Principal Component 3')
    
    
    fig.suptitle('Individual 3D Scatter Plots 2nd Metric', fontsize=16)

    
    ax.set_title(f'Group {label}')

plt.tight_layout()

plt.show()



print("---------------THIRD DISTANCE-----------------")

custom_metric3 = distance_metric(type_metric.USER_DEFINED, func=custom_distance3)

k=10

# Initialize the initial centers using k-means++ algorithm
initial_centers = kmeans_plusplus_initializer(L, k).initialize()

# Create a KMeans algorithm instance with custom distance metric
kmeans_instance3 = kmeans(L, initial_centers, metric=custom_metric3)

# Run the KMeans algorithm
kmeans_instance3.process()

# Get the clusters and their centers
labels3 = kmeans_instance3.get_clusters()
centers3 = kmeans_instance3.get_centers()

for cluster_index, cluster in enumerate(labels3):
    print(f"Cluster {cluster_index + 1}: {len(cluster)} elements")
    

# Print the results
#print("Clusters:", labels3)
#print("Centers:", centers3)

# create instance of Elbow method using K value from 1 to 10. ELBOW METHOD PLOT
kmin, kmax = 1, 10
elbow_instance = elbow(L, kmin, kmax)
# process input data and obtain results of analysis
elbow_instance.process()
amount_clusters = elbow_instance.get_amount()   # most probable amount of clusters
wce = elbow_instance.get_wce()                  # total within-cluster errors for each K
plt.plot(range(kmin, kmax + 1), wce, marker='o')
plt.xlabel('Number of clusters (K)')
plt.ylabel('Within-cluster error')
plt.title('Elbow Method 3')
plt.grid(True)
plt.show()



user_cluster_mapping = {}
for cluster_index, cluster in enumerate(labels3):
    for user_index in cluster:
        user_cluster_mapping[user_index] = cluster_index 

user_labels = [user_cluster_mapping[user_index] for user_index in range(len(L))]

color_map = {label: plt.cm.tab10(i) for i, label in enumerate(np.unique(user_labels))}

fig = plt.figure()
ax = fig.add_subplot(111,projection='3d')

for label, color in color_map.items():
    indices = np.where(user_labels == label)
    ax.scatter(userMovieRatings2_pca[indices, 0], userMovieRatings2_pca[indices, 1], userMovieRatings2_pca[indices, 2], c=[color], label=f'Group {label}')


ax.set_xlabel('Principal Component 1')
ax.set_ylabel('Principal Component 2')
ax.set_zlabel('Principal Component 3')


ax.legend()
ax.set_title('3D Scatter Plot 3rd Metric')

plt.show()

fig = plt.figure(figsize=(10, 8))

# Calculate the number of rows and columns dynamically based on the number of clusters
num_clusters = len(color_map)
num_cols = int(np.ceil(np.sqrt(num_clusters)))
num_rows = int(np.ceil(num_clusters / num_cols))

#num_rows = 2
#num_cols = len(color_map) // num_rows

for i, (label, color) in enumerate(color_map.items(), 1):
    ax = fig.add_subplot(num_rows, num_cols, i, projection='3d')
    indices = np.where(user_labels == label)
    ax.scatter(userMovieRatings2_pca[indices, 0], userMovieRatings2_pca[indices, 1], userMovieRatings2_pca[indices, 2], c=[color], label=f'Group {label}')

    ax.set_xlabel('Principal Component 1')
    ax.set_ylabel('Principal Component 2')
    ax.set_zlabel('Principal Component 3')
    fig.suptitle('Individual 3D Scatter Plots 3rd Metric', fontsize=16)

    ax.set_title(f'Group {label}')

plt.tight_layout()
plt.show()


unique_elements, counts = np.unique(user_labels, return_counts=True)
for element, count in zip(unique_elements, counts):
     print(f"Cluster {element} include {count} users.")


#-----------------------------------------------------------------------------#
#-----------------------------------------------------------------------------#


# Desired label is the cluster we choose to feed to Neural Network
desired_label = 7

vectors = userMovieRatings2
k=30 #friends

# We search for the users that belong to the desired cluster
indices_in_desired_label = [index for index, label in enumerate(user_labels) if label == desired_label]
users_in_desired_label = [vectors[index] for index in indices_in_desired_label]

# Conversion to numpy arrays
indices_array = np.array(indices_in_desired_label)

submatrix = W_custom[indices_array[:, None], indices_array]
submatrix_df = pd.DataFrame(submatrix, index=indices_array, columns=indices_array)
submatrix_df = submatrix_df.rename_axis(index='Indices', columns='Indices')
print('Distance matrix for spefic cluster',submatrix_df)

closest_indices = submatrix_df.apply(lambda row: row.nsmallest(k).index.tolist(), axis=1)
# 10 closest users to the current one

print(f"Indices of the {k} closest users for each user:")
print(closest_indices)



users = np.array([arr[0] for arr in closest_indices])  # First data points of each vector
neighbors = np.array([arr[1:] for arr in closest_indices])  #R_ua,na^(k)


ratings_matrix = userMovieRatings2  #Our previous table with users in lines and movies in columns

closest_users_matrix = indices_array # Table with indexes of users that we want
closest_users_array = np.array(indices_array)

# Choosing the lines that represent the users we want
selected_users_ratings = ratings_matrix[closest_users_matrix.flatten()]

# Matching the new dimensions
selected_users_ratings = selected_users_ratings.reshape(closest_users_matrix.shape[0], -1)

# Ignoring movies/ratings that are zeroes/ not rated
selected_users_ratings = selected_users_ratings[:, ~np.all(selected_users_ratings == 0, axis=0)]

closest_users_matrix = closest_users_matrix.reshape(1, -1)

selected_users_ratings_with_indices = np.hstack((closest_users_matrix.T, selected_users_ratings))

print("Ratings matrix for selected users:")
print(selected_users_ratings_with_indices)

print("Ratings matrix for selected users:")
print(selected_users_ratings)
 
 
df = pd.DataFrame(selected_users_ratings_with_indices)

# Making the first row as index
df.set_index(0, inplace=True)


print(df)#Rating vectors for every user

user_ratings = []


# Creating the ratings vector for each user
for user_id in users:
    # Adding the rating to the vector
    user_ratings.extend(df.loc[user_id].values)


user_ratings_array = np.array(user_ratings)
print('Y matrix',user_ratings_array)
print("Dimensions Υ:", user_ratings_array.shape)


m = len(df.T)
neighbor_ratings_all_users = []
# Through the neighbors tables we fill the rating table for each user
for neighbors in neighbors:
    neighbor_ratings_single_user = np.zeros((m,k))  #Creating a new table for the ratings of each user
    for i, neighbor_id in enumerate(neighbors):
        #Choosing the ratings of the neighbor user
        neighbor_ratings = df.loc[neighbor_id].values
        #Putting the ratings of the neighbor into the table of the selected user
        neighbor_ratings_single_user[:, i] = neighbor_ratings
    neighbor_ratings_all_users.append(neighbor_ratings_single_user)

neighbor_ratings_array = np.array(neighbor_ratings_all_users)

# Neighbors matrix
final_array = np.vstack(neighbor_ratings_array)
print('X matrix',final_array)
print("Dimensions Χ:", final_array.shape)


zero_indices = np.where(user_ratings_array == 0)[0]


user_ratings_array =user_ratings_array/10
final_array = final_array / 10 

final_array = np.delete(final_array, zero_indices, axis=0)
user_ratings_array = np.delete(user_ratings_array, zero_indices, axis=0)



zero_rows = np.where(np.all(final_array == 0, axis=1))[0]

final_array = np.delete(final_array, zero_rows, axis=0)
user_ratings_array = np.delete(user_ratings_array, zero_rows, axis=0)


users = len(df)
m = int(np.round(len(user_ratings_array)/users))
user_ratings_split = [user_ratings_array[j:j+m] for j in range(0, len(user_ratings_array), int(np.round(len(user_ratings_array)/users)))]
neighbor_ratings_split = [final_array[j:j+m] for j in range(0, len(final_array),int( np.round(len(final_array)/users)))]

train_data=[]
test_data=[]

train_data.extend(list(zip(user_ratings_split, neighbor_ratings_split)))

train_data, test_data = train_test_split(train_data, test_size=0.2, random_state=42)

user_ratings_train = np.concatenate([data[0][:, np.newaxis] for data in train_data], axis=0)
user_ratings_test = np.concatenate([data[0][:, np.newaxis] for data in test_data], axis=0)
neighbor_ratings_train = np.vstack([data[1] for data in train_data])
neighbor_ratings_test = np.vstack([data[1] for data in test_data])

print("Xtrain ",neighbor_ratings_train)
print("Dimensions Χtrain:", neighbor_ratings_train.shape)
print("Ytrain ",user_ratings_train)
print("Dimensions Ytrain:", user_ratings_train.shape)

print("Xtest ",neighbor_ratings_test)
print("Dimensions Xtest:", neighbor_ratings_test.shape)
print("Ytest ",user_ratings_test)
print("Dimensions Ytest:", user_ratings_test.shape)



dimensionality= neighbor_ratings_train.shape[1]
records_num=len(user_ratings_split[0])




model = Sequential()
model.add(Masking(mask_value=0.0))
model.add(Dense(16*dimensionality,activation='relu' ))
model.add(Dropout(0.2))
model.add(Dense(8*dimensionality,activation='relu' ))
model.add(Dropout(0.2))
model.add(Dense(4*dimensionality,activation='relu' ))
model.add(Dropout(0.2))
model.add(Dense(2*dimensionality,  activation='relu'))
model.add(Dropout(0.2))

model.add(Dense(1*dimensionality, activation='relu'))
model.add(Dropout(0.2))

model.add(Dense(int(dimensionality/2 ), activation='relu'))
model.add(Dropout(0.2))
model.add(Dense(int(dimensionality/4 ), activation='relu'))
model.add(Dropout(0.2))
model.add(Dense(1, activation='linear'))
model.build(input_shape=(None, dimensionality)) 

model.summary()

model.compile(loss='mae', optimizer='adam', metrics=['mae'])

history = model.fit(neighbor_ratings_train, user_ratings_train, epochs=400, batch_size=800, validation_split=0.2, verbose=1)


Ytest_est = np.round(model.predict(neighbor_ratings_test)*10 )/10

# Evaluate the model on the test set
loss, mae = model.evaluate(neighbor_ratings_test, user_ratings_test, verbose=1)
print("Test Loss:", loss)
print("Test MAE:", mae)




#-----------------------------------------------------------------------------#

for i in [0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1]:
    indices = np.where(Ytest_est ==i)
    print(f"Για το i={i}, βρέθηκαν {len(indices[0])} δείγματα.")


q = abs((user_ratings_test - Ytest_est)*10)

# Βρίσκουμε τις μη μηδενικές θέσεις
non_zero_indices =  np.logical_and(Ytest_est != 0, user_ratings_test != 0)
 
non_zero_user_ratings_test = user_ratings_test[non_zero_indices] 
non_zero_Ytest_est = Ytest_est[non_zero_indices]  
non_zero_Res = non_zero_user_ratings_test - non_zero_Ytest_est

  
#Res = user_ratings_test - Ytest_est
#threshold = 0.1  # Ορίστε το κατώφλι σας εδώ
#no_close_to_zero_Res = np.abs(Res[(Res > threshold)])


plt.hist(non_zero_Res, density=True, bins=30)  # density=False would make counts
plt.title('Error PDF')
plt.ylabel('Probability')
plt.xlabel('Error')
plt.grid()
plt.show()

