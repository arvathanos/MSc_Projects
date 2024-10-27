#Import all the necessary libraries for the mathematic and dimensional operations on the dataset
import os
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
#Importing the libraries that we will use for the creation of the images we want for each case
import plotly.express as px
import webbrowser

#Libraries for the creation of GIFs
from IPython.display import display, Image
import imageio
import warnings
#This library will help us to find the covid waves as requested 
from scipy.signal import find_peaks

#Retrieving the data from the web

DOWNLOAD_ROOT = "https://www.kaggle.com/sudalairajkumar/novel-corona-virus-2019-dataset/"

CONFIRMED_URL = DOWNLOAD_ROOT + "download/time_series_covid_19_confirmed"

CONFIRMED_PATH = os.path.join(r"C:\Users\arvan\Downloads\covid_19_datasets")#"datasets","covid_data")

#CONFIRMED_PATH = os.path.join("datasets","covid_data")

#Loading the data for our project
        
def load_covid_data(covid_path=CONFIRMED_PATH):
   
    confirmed_csv_path = os.path.join(covid_path, "time_series_covid_19_confirmed.csv")
    deaths_csv_path = os.path.join(covid_path, "time_series_covid_19_deaths.csv")
    recovered_csv_path = os.path.join(covid_path, "time_series_covid_19_recovered.csv")

    confirmed_data = pd.read_csv(confirmed_csv_path)
    deaths_data = pd.read_csv(deaths_csv_path)
    recovered_data = pd.read_csv(recovered_csv_path)

    return confirmed_data ,deaths_data,recovered_data


# In[2]:


#Finding the sum for all of our cases and creating a new Total Cases attribute

def report_attributes(data):
    
    summ = []
    for index, row in data.iterrows():
        province = row.iloc[0]  
        Country = row.iloc[1]  
        Lat = row.iloc[2]
        Long = row.iloc[3]
        #print("\nProvince: {},Country: {}".format(province, Country))
        total_Cases = row.iloc[-1] #this is a variable for the total cases for each country
        
        summ.append([province,Country,Lat,Long,total_Cases])
        
    summ_df = pd.DataFrame(summ, columns=["Province", "Country/Region","Lat","Long","Total Cases"])
    
    return summ_df

confirmed, deaths, recovered= load_covid_data()

#Removing the Province/State variable and organising the data based on the Country attribute
#We also get the mean of Lat and Long attributes
confirmed_cases = report_attributes(confirmed)
confirmed_total = confirmed_cases.groupby('Country/Region')['Total Cases'].sum().reset_index()
country_mean = confirmed_cases.groupby('Country/Region')[['Lat','Long']].mean().reset_index()
confirmed_Final = pd.merge(confirmed_total,country_mean, on='Country/Region')
print('The total confirmed cases is:\n',confirmed_Final,"\n")


death_cases = report_attributes(deaths)
deaths_total = death_cases.groupby('Country/Region')['Total Cases'].sum().reset_index()
deaths_Final = pd.merge(deaths_total,country_mean, on='Country/Region')
print('The total death cases is:\n',deaths_Final,"\n")

recovered_cases= report_attributes(recovered)
recovered_total = recovered_cases.groupby('Country/Region')['Total Cases'].sum().reset_index()
recovered_Final = pd.merge(recovered_total,country_mean, on='Country/Region')
print('The total of recovered cases is:\n',recovered_Final)



# In[3]:


#Here we modify and group our data based on the Country attribute
confirmed_mod = confirmed.groupby('Country/Region').sum(numeric_only=True).drop(['Lat','Long'], axis=1)
confirmed_mod = pd.merge(confirmed_mod,country_mean, on='Country/Region')

deaths_mod = deaths.groupby('Country/Region').sum(numeric_only=True).drop(['Lat','Long'], axis=1)
deaths_mod = pd.merge(deaths_mod,country_mean, on='Country/Region')

recovered_mod = recovered.groupby('Country/Region').sum(numeric_only=True).drop(['Lat','Long'], axis=1)
recovered_mod = pd.merge(recovered_mod,country_mean, on='Country/Region')


# # Ερωτημα 2

# In[4]:


#Getting each unique country there is in our dataset
unique_Country = recovered["Country/Region"].unique() #Getting all the unique countries from the dataset
print(unique_Country)


# # Ερωτημα 3
# 

# In[5]:


#Printing the start and end dates which represent the full time span of the dataset

time_span=recovered.drop(['Province/State', 'Country/Region','Lat','Long'], axis=1)
#print(list(time_span))
dates=list(time_span)
print('Start Date:',dates[0])
print('Final Date:',dates[-1])


# # ΕΡΩΤΗΜΑ 4
# In[32]:
output_folder = 'output_maps'
os.makedirs(output_folder, exist_ok=True) 

# Getting the data we need for the plot of the map for the confirmed cases 
data =pd.merge(confirmed_total,confirmed_mod, on='Country/Region') #The data that we will use for the plot
confirmed_mean = confirmed_total['Total Cases'].mean()

lat = 'Lat'  
lon = 'Long'    
fig_list = []

for date_column in ['1/22/20','5/29/21']: #Getting the dates we want to represent
    threshold_cases = 100

    data['color'] = data[date_column].apply(lambda x: 'red' if x > threshold_cases else 'magenta')
    data['size'] = data[date_column].apply(lambda x: max(x / confirmed_mean,12) if x > 100 else(6 if x!=0 else 0) ) #Code for the dot size and colour
    
    fig = px.scatter_geo(data, lat=lat, lon=lon,hover_name="Country/Region")
    fig.update_geos(showcoastlines=False, coastlinecolor="black",
                       showland=True, landcolor="lightgrey",
                       showocean=True, oceancolor="White")

    fig.update_layout(title=f"Covid Confirmed Cases - {date_column}",
                          geo=dict(
                              showframe=False,
                              showcoastlines=False,
                              showland=True,
                          ),height=700)
    fig.update_traces(
            hovertemplate='<b>%{hovertext}</b><br><br>' +
                          'Lat: %{lat}<br>' +
                          'Lon: %{lon}<br>' +
                          'Confirmed Cases: %{text:,}<extra></extra>'+
                          'Total Cases: %{customdata[0]:,}<extra></extra>',
             customdata=data[['Total Cases']],
             text=data[date_column],
             marker=dict(size=data['size'] ,color=data['color'])
        )
    fig_list.append(fig)
for i, fig in enumerate(fig_list):
    html_file_path =  os.path.join(output_folder,f'confirmed_plot_{i}.html')
    fig.write_html(html_file_path)
    
    webbrowser.open(html_file_path)

# In[30]:


# Getting the data we need for the plot of the map for the death cases.
#All the variables have the exact same functionality as mentioned above.
data = pd.merge(deaths_total,deaths_mod, on='Country/Region') #The data that we will use for the plot 
deaths_mean = deaths_total['Total Cases'].mean()
lat = 'Lat'  
lon = 'Long' 
fig_list = []

for date_column in ['1/22/20','5/29/21']: 
    threshold_cases = 100

    data['color'] = data[date_column].apply(lambda x: 'red' if x > threshold_cases else 'magenta')
    data['size'] = data[date_column].apply(lambda x: max(x / deaths_mean,12) if x >100 else(6 if x!=0 else 0) ) # Προσαρμογή του μεγέθους

    fig = px.scatter_geo(data, lat=lat, lon=lon, hover_name='Country/Region')
    fig.update_geos(showcoastlines=False, coastlinecolor="black",
                   showland=True, landcolor="lightgrey",
                   showocean=True, oceancolor="White")

    fig.update_layout(title=f"Covid Deaths Cases - {date_column}",
                      geo=dict(
                          showframe=False,
                          showcoastlines=False,
                          showland=True,
                      ),height=700)
    fig.update_traces(
        hovertemplate='<b>%{hovertext}</b><br><br>' +
                      'Lat: %{lat}<br>' +
                      'Lon: %{lon}<br>' +
                      'Deaths Cases: %{text:,}<extra></extra>'+
                      'Total Cases: %{customdata[0]:,}<extra></extra>',
             customdata=data[['Total Cases']],
             text=data[date_column],
             marker=dict(size=data['size'] ,color=data['color'])
    )
    fig_list.append(fig)
    
for i, fig in enumerate(fig_list):
    html_file_path =  os.path.join(output_folder,f'deaths_plot_{i}.html')
    fig.write_html(html_file_path)
    
    webbrowser.open(html_file_path)

# In[35]:


# Getting the data we need for the plot of the map for the confirmed cases
#All the variables have the exact same functionality as mentioned above.
data = pd.merge(recovered_total,recovered_mod, on='Country/Region') #The data that we will use for the plot 
recovered_mean = recovered_total['Total Cases'].mean()
lat = 'Lat'  
lon = 'Long'  
fig_list = []

for date_column in ['1/22/20','5/29/21']: 
    threshold_cases = 100

    data['color'] = data[date_column].apply(lambda x: 'red' if x > threshold_cases else 'magenta')
    data['size'] = data[date_column].apply(lambda x: max(x / recovered_mean,12) if x > 100 else(6 if x!=0 else 0) )  #The data that we will use for the plot
    
    fig = px.scatter_geo(data, lat=lat, lon=lon, hover_name="Country/Region")
    fig.update_geos(showcoastlines=False, coastlinecolor="black",
                   showland=True, landcolor="lightgrey",
                   showocean=True, oceancolor="White")

    fig.update_layout(title=f"Covid recovered Cases {date_column}",
                      geo=dict(
                          showframe=False,
                          showcoastlines=False,
                          showland=True,
                      ),height=700)
    fig.update_traces(
        hovertemplate='<b>%{hovertext}</b><br><br>' +
                      'Lat: %{lat}<br>' +
                      'Lon: %{lon}<br>' +
                      'Recovered Cases: %{text:,}<extra></extra>'+
                      'Total Cases: %{customdata[0]:,}<extra></extra>',
             customdata=data[['Total Cases']],
             text=data[date_column],
             marker=dict(size=data['size'] ,color=data['color'])
    )
    fig_list.append(fig)
    
for i, fig in enumerate(fig_list):
    html_file_path = os.path.join(output_folder, f'recovered_plot_{i}.html')
    fig.write_html(html_file_path)
    
    webbrowser.open(html_file_path)
# # ΕΡΩΤΗΜΑ 5/gif

# In[9]:


list_of_dates  = confirmed_mod.columns[1:-4].tolist()
date_columns = list_of_dates  


# # confirmed.gif

# In[10]:

output_folder = 'output_gif'
os.makedirs(output_folder, exist_ok=True)

#Getting the necessary data to create the GIF images
warnings.filterwarnings("ignore", category=DeprecationWarning)

#Modifying our variables as seen below.
data = confirmed_mod 
confirmed_mean = confirmed_total['Total Cases'].mean()
lat = 'Lat'  
lon = 'Long'  

#Creating an image for each day of the data set

images = [] #The array that will hold all of our images.

for date_column in date_columns:
    threshold_cases = 100

    data['color'] = data[date_column].apply(lambda x: 'red' if x > threshold_cases else 'magenta')
    data['size'] = data[date_column].apply(lambda x: max(x / confirmed_mean,12) if x > 100 else(6 if x!=0 else 0) ) # Adapting the size
    
    fig = px.scatter_geo(data, lat=lat, lon=lon)
    fig.update_geos(showcoastlines=False, coastlinecolor="black",
                       showland=True, landcolor="lightgrey",
                       showocean=True, oceancolor="White")

    fig.update_layout(title=f'Covid Confirmed Cases - {date_column}',
                          geo=dict(
                              showframe=False,
                              showcoastlines=False,
                              showland=True,
                          ),height=700)
    fig.update_traces(
             marker=dict(size=data['size'] ,color=data['color'])
        )
    # Adding each image to the array we created above
    images.append(imageio.imread(fig.to_image(format="png")))
    
    
warnings.filterwarnings("default", category=DeprecationWarning)

# Saving and Plotting the GIF
output_path = os.path.join(output_folder,'covid_map_animation_confirmed.gif')
imageio.mimsave(output_path, images, duration=0.1)  

with open(output_path, "rb") as f:
    display(Image(data=f.read(), format="png"))


# # Deaths.gif

# In[11]:


#Here everything remains the same and follows the same methodology as above.
warnings.filterwarnings("ignore", category=DeprecationWarning)

#Modifying our variables as seen below.
data = deaths_mod
deaths_mean = deaths_total['Total Cases'].mean()

images = [] #The array that will hold all of our images.

for date_column in date_columns:
    threshold_cases = 100

    data['color'] = data[date_column].apply(lambda x: 'red' if x > threshold_cases else 'magenta')
    data['size'] = data[date_column].apply(lambda x: max(x / deaths_mean,12) if x > 100 else(6 if x!=0 else 0) )
  
    fig = px.scatter_geo(data, lat=lat, lon=lon)
    fig.update_geos(showcoastlines=False, coastlinecolor="black",
                    showland=True, landcolor="lightgrey",
                    showocean=True, oceancolor="White")
    
    fig.update_layout(title=f'Covid Deaths Cases - {date_column}',
                          geo=dict(
                              showframe=False,
                              showcoastlines=False,
                              showland=True,
                          ),height=700)

    fig.update_traces(
             marker=dict(size=data['size'] ,color=data['color'])
        )
    # Adding each image to the array we created above  
    images.append(imageio.imread(fig.to_image(format="png")))
    
# Saving and Plotting the GIF
output_path = os.path.join(output_folder,'covid_map_animation_deaths.gif')
imageio.mimsave(output_path, images, duration=0.1) 

with open(output_path, "rb") as f:
    display(Image(data=f.read(), format="png"))


# # recover.gif

# In[12]:


#Getting the necessary data to create the GIF images
warnings.filterwarnings("ignore", category=DeprecationWarning)
#Modifying our variables as seen below.
data = recovered_mod
recovered_mean = recovered_total['Total Cases'].mean()

#Creating an image for each day of the data set

images = [] #The array that will hold all of our images.

for date_column in date_columns:
    threshold_cases = 100

    data['color'] = data[date_column].apply(lambda x: 'red' if x > threshold_cases else 'magenta')
    data['size'] = data[date_column].apply(lambda x: max(x / recovered_mean,12) if x > 100 else(6 if x!=0 else 0) )

    fig = px.scatter_geo(data, lat=lat, lon=lon)
    fig.update_geos(showcoastlines=False, coastlinecolor="black",
                    showland=True, landcolor="lightgrey",
                    showocean=True, oceancolor="White")
    
    fig.update_layout(title=f'Covid recovered Cases - {date_column}',
                          geo=dict(
                              showframe=False,
                              showcoastlines=False,
                              showland=True,
                          ),height=700)

    fig.update_traces(
             marker=dict(size=data['size'] ,color=data['color'])
        )

    # Adding each image to the array we created above
    images.append(imageio.imread(fig.to_image(format="png")))
    
    
# Saving and Plotting the GIF
output_path = os.path.join(output_folder,'covid_map_animation_recover.gif')
imageio.mimsave(output_path, images, duration=0.1)  # Το duration είναι ο χρόνος εμφάνισης ανά εικόνα σε δευτερόλεπτα


with open(output_path, "rb") as f:
    display(Image(data=f.read(), format="png"))


# # Ερωτημα 6

# In[13]:


#Plotting the three graphs of the top 10 countries for each case of study

if not os.path.exists('figures'):
    os.makedirs('figures')


#total_confirmed = report_attributes(confirmed)
total_confirmed = confirmed_Final.drop(['Lat', 'Long'], axis=1)


total_deaths = deaths_Final.drop(['Lat', 'Long'], axis=1)


total_recovered = recovered_Final.drop(['Lat', 'Long'], axis=1)


top10_confirmed = total_confirmed.sort_values(by='Total Cases', ascending=False).head(10)
plt.figure(figsize=(10, 6))
plt.barh(top10_confirmed['Country/Region'], top10_confirmed['Total Cases'], color='orange')
plt.xlabel(' Total confirmed')
plt.title('Top 10 confirmed')
plt.gca().invert_yaxis()
plt.savefig('figures/top10_confirmed.png')  
plt.show()


top10_deaths = total_deaths.sort_values(by='Total Cases', ascending=False).head(10)
plt.figure(figsize=(10, 6))
plt.barh(top10_deaths['Country/Region'], top10_deaths['Total Cases'], color='orange')
plt.xlabel(' Total deaths')
plt.title('Top 10 deaths')
plt.gca().invert_yaxis()  
plt.savefig('figures/top10_deaths.png')  

plt.show()


top10_recovered = total_recovered.sort_values(by='Total Cases', ascending=False).head(10)
plt.figure(figsize=(10, 6))
plt.barh(top10_recovered['Country/Region'], top10_recovered['Total Cases'], color='orange')
plt.xlabel(' Total recovered')
plt.title('Top 10 recovered')
plt.gca().invert_yaxis()  
plt.savefig('figures/top10_recovered.png')  

plt.show()


# # Ερωτημα 7A

# In[14]:


#Creating a table for the top 10 countries
top_countries = top10_confirmed['Country/Region']


# In[15]:
output_folder = 'plots'
os.makedirs(output_folder, exist_ok=True)

#Aggregate the plots
new_confirmed=confirmed_mod.drop(['Lat', 'Long','size','color'],axis=1)
new_confirmed=new_confirmed.set_index('Country/Region').diff(periods=1,axis=1).fillna(0)
# Avoid negative values
new_confirmed = new_confirmed.clip(lower=0)
dates = new_confirmed.columns


num_rows = int(np.ceil(len(top_countries) / 4))
fig, axes = plt.subplots(nrows=num_rows, ncols=4, figsize=(20, 4 * num_rows))


for i ,country in enumerate(top_countries):
    cases = new_confirmed.loc[country, dates].values
    
    row_num = i // 4
    col_num = i % 4
    axes[row_num, col_num].plot(dates, cases, color='orange')
    axes[row_num, col_num].set_xlabel('Date')
    axes[row_num, col_num].set_ylabel('New Cases')
    axes[row_num, col_num].set_title(country )
    axes[row_num, col_num].set_xticks(dates[::len(dates)//5])
    
# Remove the last two subplots
for i in range(2):
    fig.delaxes(axes.flatten()[-(i + 1)])

plt.tight_layout()
plt.savefig(os.path.join(output_folder, 'new_cases_plot.png'))
plt.show()


# In[16]:


for i ,country in enumerate(top_countries):
    
    cases = new_confirmed.loc[country, dates].values
    plt.plot(dates, cases, color='orange')
    #plt.xlabel('As of 29-may-21')
    plt.ylabel('New Cases')
    plt.title(country)
    plt.xticks(dates[::len(dates)//5])
    plt.tight_layout()
    
    plt.savefig(os.path.join(output_folder, f'new_cases_plot_{country}.png'))
    plt.show()


# # Ερωτημα 7B

# In[17]:

output_folder = 'Waves_plots'
os.makedirs(output_folder, exist_ok=True)


#With this for loop we will find each COVID wave for each one country there is 
#in the Top 10 countries array.
for country in top_countries:

    smoothed_data = new_confirmed.loc[country].rolling(window=15).mean()
    
    peaks = find_peaks(smoothed_data, prominence=1,  height=smoothed_data.max() * 0.1, width=10)
    
    enlargement_percentage = 0.3
    left_ips_enlarged = peaks[1]["left_ips"] - (peaks[1]["widths"] * enlargement_percentage)
    right_ips_enlarged = peaks[1]["right_ips"] + (peaks[1]["widths"] * enlargement_percentage)

    plt.plot(dates,smoothed_data, label=country , color ='orange')
    plt.scatter(dates[peaks[0]], smoothed_data.iloc[peaks[0]],
                    marker='o', color='blue', label='Date Peaks', s=peaks[1]["peak_heights"]*2/9000)
    print(f'\nWaves for {country}:')
    for start, end in zip(dates[left_ips_enlarged.astype(int)], dates[right_ips_enlarged.astype(int)]):
        print(f"Duration of the wave: {start} - {end}")

    for start, end in zip(left_ips_enlarged.astype(int), right_ips_enlarged.astype(int)):
        plt.axvspan(start, end, alpha=0.4, color='gray')

    plt.xticks(dates[peaks[0]], rotation=45)
    plt.xlabel('Date')
    plt.ylabel('Cases')
    plt.title(country)
    plt.tight_layout()
    plt.savefig(os.path.join(output_folder, f'Wave_plot_{country}.png'))
    plt.show()



