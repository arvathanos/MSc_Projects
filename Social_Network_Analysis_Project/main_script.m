data = importdata('sx-stackoverflow.txt');

col3 = data(:,3);

%Μέγιστη και ελάχιστη χρονική στιγμή σε δευτερόλεπτα.
t_min = min(col3) ; 
t_max = max(col3);

DT = t_max - t_min ;
%Ν τα διαστήματα του  χρόνου
N = 1000;
delta = DT/N;
edges = t_min:delta:t_max ; 

[~, bins] = histc(col3, edges);
%Δημιουργία Ν πινάκων όπου ο καθένας περιέχει τους χρήστες που ανοίκουν σε 
%ενα συγκεκριμένο χρονικό διάστημα delta.
subarrays = cell(1, N);
for i = 1:N
    subarrays{i} = data(bins == i, :);
end


%Παίρνουμε για παράδειγμα τον 700 υποπίνακα.
connections = num2cell(subarrays{700}(:,1:2)) ;
%Μοναδικά id 
unique_names = unique([connections{:}]);
N = length(unique_names) ;
fprintf('\n Numbers of nodes: %d \n',N)
%με την βοήθεια το name_to_id_map το ματλαμπ συνδέει το id με το index στον
%πίνακα.
name_to_id_map = containers.Map(unique_names, 1:length(unique_names));

%Πίνακας γειτνίασης W.
W = zeros(length(unique_names));
for i = 1:length(connections)
    user1 = name_to_id_map(connections{i,1});
    user2 = name_to_id_map(connections{i,2});
    W(user1, user2) = 1;
    W(user2, user1) = 1;
end
%%
%Δημιουργία του γραφήματος 

G = graph(W);

p = plot(G);


%%
%Αναπαράσταση των συνδέσεων των χρηστών με το χρόνο μέσα σε μία υποομάδα 
% Αρχικοποίηση του GIF
filename = 'graph_evolution.gif';

% Εμφάνιση του αρχικού γράφου
fig = figure;

W = zeros(length(unique_names));

% Καταγραφή του αρχικού καρέ
frame = getframe(fig);
im = frame2im(frame);
[imind,cm] = rgb2ind(im,256);
imwrite(imind,cm,filename,'gif','Loopcount',inf);
%Ορίσμός των καρέ του gif
total_frames = 100;
q = round(length(connections)/total_frames);

for i = 1: length(connections)
    % Προσθήκη κάθε φορα, της επόμενης ακμής.
    node1 = name_to_id_map(connections{i,1});
    node2 = name_to_id_map(connections{i,2});
    W(node1, node2) = 1;
    W(node2, node1) = 1;
    if i == q
        % Εμφάνιση του ενημερωμένου γράφου.
        G = graph(W);
        plot(G);
        % Καταγραφή του καρέ.
        frame = getframe(fig);
        im = frame2im(frame);
        [imind,cm] = rgb2ind(im,256);
        imwrite(imind,cm,filename,'gif','WriteMode','append');
        q = q + round(length(connections)/total_frames);
    end   
    
end

%%
% Αναπαράσταση της εξέλιξης των χρονικών συδέσεων των χρηστών στο σύνολο.
% Αρχικοποίηση του GIF
filename = 'graph_evolution2.gif';

% Εμφάνιση του αρχικού γράφου
fig = figure;
frames = 20;
N=1000;
x = round(N / frames);%το βήμα

for i = 1 : x : N
    connections = num2cell(subarrays{i}(:,1:2)) ;
    %Μοναδικά id 
    unique_names = unique([connections{:}]);
    
    W = zeros(length(unique_names));
    
   
    name_to_id_map = containers.Map(unique_names, 1:length(unique_names));

    for j = 1: length(connections)
        % Προσθήκη κάθε φορα, της επόμενης ακμής.
        node1 = name_to_id_map(connections{j,1});
        node2 = name_to_id_map(connections{j,2});
        W(node1, node2) = 1;
        W(node2, node1) = 1;
    end 
    
     % Εμφάνιση του ενημερωμένου γράφου.
     G = graph(W);
     plot(G);

     title(['Group of users: ', num2str(i)]);
    % Καταγραφή του καρέ
    frame = getframe(fig);
    im = frame2im(frame);
    [imind,cm] = rgb2ind(im,256);
    
     % Αποθήκευση του πρώτου frame
    if i == 1
        imwrite(imind,cm,filename,'gif','Loopcount',inf);
    else
        % Αποθήκευση των επόμενων frames
        imwrite(imind,cm,filename,'gif','WriteMode','append');
    end     
    
end
%%
%   (a) Degree Centrality

degree = centrality(G,'degree','Importance',G.Edges.Weight);
p.NodeCData = degree;
colormap jet
colorbar
title('degree Centrality')


n = size(W, 1);
min_degree = min(degree);
max_degree = max(degree);
degrees_range = min_degree:max_degree;
H = histcounts(degree,degrees_range);

P_Centrality = H / n;

figure('Name','Degree Centrality Distribution');
bar(degrees_range(1:end-1),P_Centrality,'histc');
axis([min_degree-1 50 0 max(P_Centrality)+0.005]);
xlabel('Degrees');
ylabel('Absolute Frequency');

%%
%   (b) Closeness Centrality

wcc = centrality(G,'closeness','Cost',G.Edges.Weight);
p.NodeCData = wcc;
colormap jet
colorbar
title('Closeness Centrality Scores - Weighted')

% Υπολογισμός kernel density estimate για τη closeness centrality
% Με το kernel density κάνουμε την συνάρτηση συνεχής πάνω στις τιμές της
[f, xi] = ksdensity(wcc(wcc > 1e-8));
%Εβγαλα τις τιμές που έχουν Closeness Centrality = 0 με ακρίβεια 10^-8

% Σχεδίαση του γραφήματος
figure('Name', 'Closeness Centrality Distribution');
plot(xi, f, 'LineWidth', 2);
xlabel('Closeness Centrality');
ylabel('Density Estimation');
%Eδω έχουμε στον y της τιμές της συνάρτησης πυκνότητας πιθανότητας.

title('Closeness Centrality Distribution');


[counts, edges] = histcounts(wcc);

% Κανονικοποίηση των συχνοτήτων
probabilities = counts / sum(counts);

% Σχεδίαση του γραφήματος
figure;
bar(edges(1:end-1), probabilities, 'hist');
xlabel('Closeness Centrality');
ylabel('Probability');
title('Probability Distribution of Closeness Centrality');



%%
%   (c) Betweenness Centrality

wbc = centrality(G,'betweenness','Cost',G.Edges.Weight);
n = numnodes(G);
% κανονικοποίηση των αποτελεσμάτων ώστε να παίρνουμε σαν την τιμή μια
% πιθανότητα στο [0,1] , Η πιθανότητα διατρέχοντας την συντομότερη διαδρομή
% μεταξύ δύο κόμβων να περάσουμε απο έναν συγκεκριμένο κόμβο.
p.NodeCData = 2*wbc./((n-2)*(n-1));
colormap(flip(autumn,1));
colorbar
title('Betweenness Centrality Scores - Weighted')

normalize = 2*wbc./((n-2)*(n-1));
[counts, edges] = histcounts(normalize);

probabilities = counts / sum(counts);

figure;
bar(edges(1:end-1), probabilities, 'hist');
xlabel('Betweenness Centrality Probability');
ylabel('Probability');
title('Probability Distribution of Betweenness Centrality');
grid    on;

%%
% (d) Eigenvector Centrality

wec = centrality(G,'eigenvector','Importance',G.Edges.Weight);
p.NodeCData = wec;
colormap jet
colorbar
title('Eigenvector Centrality Scores ')


[counts, edges] = histcounts(wec);

% Κανονικοποίηση των συχνοτήτων ως πιθανότητες
probabilities = counts / sum(counts);

% Σχεδίαση του γραφήματος
figure;
bar(edges(1:end-1), probabilities, 'histc');
xlabel('Eigenvector Centrality');
ylabel('Probability');
title('Probability Distribution of Eigenvector Centrality');
grid on;
%%
%   (e) Katz Centrality
%Ο α είναι μια μεταβλητή η οποία  πρέπει να είναι μικρότερη απο 1/λ , οπου
%λ η ιδιοτιμες του W.
%-------------------------------------------------------------------------%
%-------------------------------------------------------------------------%

n = size(W, 1);
I = eye(n);
alpha = 0.9 * (1 / max(eig(W)));
katz_matrix  = ((I - alpha * W)^-1) ;
katz_centrality = sum(katz_matrix, 1);
%%
p.NodeCData = katz_centrality;
colormap jet
colorbar
title('Katz Centrality')

[counts, edges] = histcounts(katz_centrality);

probabilities = counts / sum(counts);
figure;
bar(edges(1:end-1), probabilities, 'histc');
xlabel('Katz Centrality');
ylabel('Probability');
title('Probability Distribution of Katz Centrality');
grid on;

%%
%-------------------------------------------------------------------------%
%-------------------------------------------------------------------------%
%                                PART II
%-------------------------------------------------------------------------%
%-------------------------------------------------------------------------%
%ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ
%
num_pairs = length(subarrays) - 1;

% Αρχικοποίηση του πλήθος των κελιών
counts_connections_A = zeros(num_pairs, 1); % E*[first period]
counts_connections_B = zeros(num_pairs, 1); % E*[second period]
counts_nodes = zeros(num_pairs, 1); % V*[]

for k = 1:(length(subarrays) - 1)
    connections_A = num2cell(subarrays{k}(:, 1:2));
    connections_B = num2cell(subarrays{k+1}(:, 1:2));
    
    % Εύρεση των μοναδικών κόμβων
    nodes_prev  = unique([connections_A{:}]);
    nodes_next  = unique([connections_B{:}]);

    %(α) οι κοινές κορυφές στα δύο πρώτα γραφήματα
    common_nodes = intersect(nodes_prev, nodes_next);
    
    counts_nodes(k) = length(common_nodes);

    % Μετατροπή σε πίνακες
    connections_A_mat = cell2mat(connections_A);
    connections_B_mat = cell2mat(connections_B);

    %Βρίσκουμε τις γραμμές όπου ισχύει το ζητούμενο
    is_common_A = ismember(connections_A_mat(:, 1), common_nodes) & ismember(connections_A_mat(:, 2), common_nodes);
    is_common_B = ismember(connections_B_mat(:, 1), common_nodes) & ismember(connections_B_mat(:, 2), common_nodes);
    
    %(β,γ) Τα ζευγάρια των ακμών για κάθε μία περίοδο.
    filtered_connections_A = connections_A_mat(is_common_A, :);
    filtered_connections_B = connections_B_mat(is_common_B, :);
    
    % Υπολογισμός πλήθους συνδέσεων για κάθε κελί
    counts_connections_A(k) = length(filtered_connections_A);
    counts_connections_B(k) = length(filtered_connections_B);
end

prev_count_connections_A = zeros(num_pairs, 1);
prev_count_connections_B= zeros(num_pairs, 1);

for i = 1:(length(subarrays) - 1)
   prev_count_connections_A(i)=length(subarrays{i}(:,1));
   prev_count_connections_B(i)=length(subarrays{i+1}(:,1));
end

combined_counts_A = [prev_count_connections_A,counts_connections_A];
combined_counts_B = [prev_count_connections_B,counts_connections_B];

% valuesΔΗΜΙΟΥΡΓΙΑ ΡΑΒΔΟΓΡΑΜΜΑΤΟΣ ΓΙΑ ΤΟΝ ΑΡΙΘΜΟ ΣΥΝΔΕΣΕΩΝ ΜΕ ΤΙΣ
% ΠΡΟΗΓΟΥΜΕΝΕΣ ΑΚΜΕΣ
figure;
subplot(2, 1, 1);
bar(1:num_pairs, combined_counts_A, 'grouped');
title('Number of Connections - Column A');
xlabel('Time periods');
ylabel('Volume');
legend('Previous','Current');

subplot(2, 1, 2);
bar(1:num_pairs, combined_counts_B, 'grouped');
title('Number of Connections - Column B');
xlabel('Time periods');
ylabel('Volume');
legend( 'Previous','Current');
%ΔΗΜΙΟΥΡΓΙΑ ΡΑΒΔΟΑΓΡΑΜΜΑΤΟΣ ΓΙΑ ΤΟΝ ΑΡΙΘΜΟ ΤΩΝ ΚΟΜΒΩΝ
figure;
bar(1:num_pairs, counts_nodes);
title('Number of Nodes');
xlabel('Time periods');
ylabel('Volume');

%%
%-------------------------------------------------------------------------%
%                          Graph Distance
%-------------------------------------------------------------------------%
%Η επιλογή του κ αναφέρεται στην περίοδο όπου θα υπολογίσουμε του πίνακες
%ομοιότητας καθως και του νευρωνικού δικτύου μας: [κ,κ+1]

k=980;
    connections_A = num2cell(subarrays{k}(:, 1:2));
    connections_B = num2cell(subarrays{k+1}(:, 1:2));
    
    % Εύρεση των μοναδικών κόμβων
    nodes_prev  = unique([connections_A{:}]);
    nodes_next  = unique([connections_B{:}]);

    %(α) οι κοινές κορυφές στα δύο πρώτα γραφήματα
    common_nodes = intersect(nodes_prev, nodes_next);
    
    % Μετατροπή σε πίνακες
    connections_A_mat = cell2mat(connections_A);
    connections_B_mat = cell2mat(connections_B);

    %Βρίσκουμε τις γραμμές όπου ισχύει το ζητούμενο
    is_common_A = ismember(connections_A_mat(:, 1), common_nodes) & ismember(connections_A_mat(:, 2), common_nodes);
    is_common_B = ismember(connections_B_mat(:, 1), common_nodes) & ismember(connections_B_mat(:, 2), common_nodes);
    
    %(β,γ) Τα ζευγάρια των ακμών για κάθε μία περίοδο.
    filtered_connections_A = connections_A_mat(is_common_A, :);
    filtered_connections_B = connections_B_mat(is_common_B, :);

    filtered_connections_A = num2cell(filtered_connections_A);
    filtered_connections_B = num2cell(filtered_connections_B);

    filtered_nodes_prev  = unique([filtered_connections_A{:}]);
    filtered_nodes_next  = unique([filtered_connections_B{:}]);

fprintf('\n For k =  %d \n',k)

fprintf('\n Previous Unique  Nodes %d \n',length(filtered_nodes_prev))
fprintf('\n Next Unique  Nodes %d \n',length(filtered_nodes_next))
fprintf('\n Previous Edges %d \n',length(filtered_connections_A))
fprintf('\n Next Edges %d \n',length(filtered_connections_B))
fprintf('\n common_nodes %d \n',numel(common_nodes))


%%

%ΠΙΝΑΚΑΣ ΓΕΙΤΝΙΑΣΗΣ ΚΑΙ ΤΩΝ ΔΥΟ ΠΕΡΙΟΔΩΝ
num_common_nodes = length(common_nodes);
common_nodes_index_map = containers.Map(common_nodes, 1:num_common_nodes);
filtered_connectionsAB = [filtered_connections_A; filtered_connections_B];
%Πίνακας γειτνίασης W_common.
W_common = zeros(num_common_nodes);

for i = 1:length(filtered_connectionsAB)
    user1 = common_nodes_index_map(filtered_connectionsAB{i,1});
    user2 = common_nodes_index_map(filtered_connectionsAB{i,2});
    W_common(user1, user2) = 1;
    W_common(user2, user1) = 1;
end

%%
%ΥΠΟΛΟΓΙΖΟΥΜΕ ΟΛΟΥΣ ΤΟΥΣ ΠΊΝΑΚΕΣ ΤΟΥ ΕΡΩΤΗΜΑΤΟΣ ΙΙ

%Για το ερώτημα ΙΙ κάνουμε χρήση του πίνακα γειτνίασης W_common.
%Για το ερώτημα ΙΙΙ όμως χρησιμοποιούμε τον πίνακα W1.
G_common = graph(W_common);
%Υπολογίζουμε τις γεωδαισικές αποστάσεις = κοντινότερο μονοπάτι.
distances = distances(G_common);
distances(isinf(distances)) = max(distances(~isinf(distances))) + 1;

GD = -distances;
save('graph_distance.mat','GD')

neighbor_sets = compute_neighbor_sets(W_common, common_nodes);

%-------------------------------------------------------------------------%
%                          Common Neighbors
%Υπολογίζουμε το πλήθος των κοινών γειτόνων μεταξύ δύο κόμβων

CN = compute_common_neighbors(W_common,neighbor_sets);

% Αποθήκευση του πίνακα common neighbors (CN)
%save('common_neighbors.mat', 'CN');

%-------------------------------------------------------------------------%
%                          Jaccard's Coefficient

JC = compute_Jaccars_Coefficient(W_common,neighbor_sets);

% Αποθήκευση του πίνακα Jaccard's Coefficient (JC)
%save('jaccards_coefficient.mat', 'JC');
%-------------------------------------------------------------------------%
%                          Adamic / Adar tik

A = compute_adamic_adar(W_common,neighbor_sets);

% Αποθήκευση του πίνακα Adamic / Adar (A)
%save('adamic_adar.mat', 'A');

%-------------------------------------------------------------------------%
%                         Preferential Attachment tik

PA = compute_preferential_attachment(W_common,neighbor_sets);

% Αποθήκευση του πίνακα Preferential Attachment (PA)
%save('preferential_attachment.mat', 'PA');

%%
%-------------------------------------------------------------------------%
%-------------------------------------------------------------------------%
%                                PART III
%-------------------------------------------------------------------------%
%-------------------------------------------------------------------------%
%ΠΙΝΑΚΑΣ ΓΕΙΤΝΙΑΣΗΣ ΤΗΣ ΠΕΡΙΟΔΟΥ Κ

W1 = zeros(length(filtered_nodes_prev));
num_common_nodes = length(common_nodes);
common_nodes_index_map = containers.Map(common_nodes, 1:num_common_nodes);
for i = 1:length(filtered_connections_A)
    user1 = common_nodes_index_map(filtered_connections_A{i,1});
    user2 = common_nodes_index_map(filtered_connections_A{i,2});
    W1(user1, user2) = 1;
    W1(user2, user1) = 1;
end


%Υπολογίζουμε τους πίνακες ομοιότητας με βάση τον πίνακα γειτνίασης W1
G_w1 = graph(W1);
%Υπολογίζουμε τις γεωδαισικές αποστάσεις = κοντινότερο μονοπάτι.
distances = distances(G_w1);
distances(isinf(distances)) = max(distances(~isinf(distances))) + 1;

GD = -distances;
save('graph_distance.mat','GD')


neighbor_sets = compute_neighbor_sets(W1, common_nodes);
%-------------------------------------------------------------------------%
%                          Common Neighbors
%Υπολογίζουμε το πλήθος των κοινών γειτόνων μεταξύ δύο κόμβων

CN = compute_common_neighbors(W1,neighbor_sets);

% Αποθήκευση του πίνακα common neighbors (CN)
save('common_neighbors.mat', 'CN');

%-------------------------------------------------------------------------%
%                          Jaccard's Coefficient
JC = compute_Jaccars_Coefficient(W1,neighbor_sets);

% Αποθήκευση του πίνακα Jaccard's Coefficient (JC)
save('jaccards_coefficient.mat', 'JC');

%-------------------------------------------------------------------------%
%                          Adamic / Adar tik

A = compute_adamic_adar(W1,neighbor_sets);

% Αποθήκευση του πίνακα Adamic / Adar (A)
save('adamic_adar.mat', 'A');

%-------------------------------------------------------------------------%
%                         Preferential Attachment tik

PA = compute_preferential_attachment(W1,neighbor_sets);

% Αποθήκευση του πίνακα Preferential Attachment (PA)
save('preferential_attachment.mat', 'PA');

C_combined = cat(3,GD,CN,JC,A,PA);


%create Eprev , Enext

edges_prev = zeros(size(filtered_connections_A, 1), size(C_combined, 3));

for i = 1:size(filtered_connections_A, 1)
    node1 = common_nodes_index_map(filtered_connections_A{i, 1}); 
    node2 = common_nodes_index_map(filtered_connections_A{i, 2}); 
    
    edge_features = reshape(C_combined(node1, node2, :), 1, []);
    
    edges_prev(i, :) = edge_features;
end

edges_next = zeros(size(filtered_connections_B, 1), size(C_combined, 3));

for i = 1:size(filtered_connections_B, 1)
    node11 = common_nodes_index_map(filtered_connections_B{i, 1}); 
    node22 = common_nodes_index_map(filtered_connections_B{i, 2}); 
    
    edge_features = reshape(C_combined(node11, node22, :), 1, []);
    
    edges_next(i, :) = edge_features;
end

%-------------------------------------------------------------------------%

%%
%create Enone
%create all edges
% Υπολογισμός του συνολικού αριθμού των κόμβων
num_nodes = size(C_combined, 1);

% Υπολογισμός του αριθμού των διανυσμάτων χαρακτηριστικών
num_features = size(C_combined, 3);

% Υπολογισμός του συνολικού αριθμού των ζευγών κόμβων (i, j) 
num_pairs = num_nodes * (num_nodes + 1) / 2;

edges_none = zeros(num_pairs, num_features);

index = 1;

for i = 1:num_nodes
    for j = i:num_nodes
        edge_features = reshape(C_combined(i, j, :), 1, []);
        
        edges_none(index, :) = edge_features;
        
        index = index + 1;
    end
end

%delete from edges_none the edges prev and next!

% Οι δείκτες των κοινών γραμμών στον edges_prev
[is_in_edges_prev, idx_edges_prev ]= ismember(edges_prev, edges_none, 'rows');
indices_in_edges_prev = idx_edges_prev(is_in_edges_prev);

% Οι δείκτες των κοινών γραμμών στον edges_next
[is_in_edges_next, idx_edges_next] = ismember(edges_next, edges_none, 'rows');
indices_in_edges_next = idx_edges_next(is_in_edges_next);

%Αφαιρώ τις γραμμές που είναι κοινές με το prev & next
indices_to_remove = unique([indices_in_edges_prev; indices_in_edges_next]);
indices_to_remove = sort(indices_to_remove, 'descend');
edges_none(indices_to_remove, :) = [];

%Αφαιρώ τις γραμμές όπου έχουν μηδενικές γραμμές
edges_none(all(edges_none == 0, 2), :) = [];
%%
%                  ΟΡΙΖΟΥΜΕ ΤΟ ΚΕΝΤΡΟ ΤΟΥ PREV
center_prev = mean(edges_prev, 1);
distances_to_center_prev = sqrt(sum((edges_none - center_prev) .^ 2, 2));

%%
[~,sorted_indices_prev] = sort(distances_to_center_prev);
closest_indices_prev = sorted_indices_prev(1:3*size(edges_prev,1));


%ΠΙΟ ΑΠΟΤΕΛΕΣΜΑΤΙΚΟ ΝΑ ΠΑΡΟΥΜΕ ΣΑΝ ΚΕΝΤΡΟ ΤΟ center_prev
%common = [closest_indices_next ,closest_indices_prev];

unique_common = unique(closest_indices_prev);
%unique_common = unique(common);
%%

random_indices = unique_common(randperm(length(unique_common)));

split_point = ceil(length(random_indices) / 2);
indices_prev = random_indices(1:split_point);
indices_next = random_indices(split_point+1:end);


edges_none_prev = edges_none(indices_prev, :);
edges_none_next = edges_none(indices_next, :);


X_train = [edges_prev; edges_none_prev];% 1 ,  1,5
x_test  = [edges_next; edges_none_next];% 1 ,  1,5

Y_train = [ones(size(edges_prev,1),1); zeros(size(edges_none_prev,1),1) ];
Y_test = [ones(size(edges_next,1),1); zeros(size(edges_none_next,1),1)];

%%

hiddenLayerSizes = [10 5 2];
net = feedforwardnet(hiddenLayerSizes);

net.layers{1}.transferFcn = 'tansig';
net.layers{2}.transferFcn = 'tansig';
%net.layers{3}.transferFcn = 'tansig';
net.layers{3}.transferFcn = 'purelin'; %γραμμική
net.trainFcn = 'trainlm'; %% trainlm , trainscg , trainrp , trainbr
net.trainParam.epochs = 500;
%net.trainParam.goal = 0.00001;  %  MSE
net.trainParam.lr = 0.0001;
net = train(net, X_train', Y_train');


Y_pred = net(x_test');
Y_pred = round(Y_pred);

accuracy = sum(Y_pred == Y_test') / numel(Y_test');

disp(['Test Accuracy: ', num2str(accuracy)]);





