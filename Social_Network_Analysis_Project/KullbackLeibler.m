% Υπολογισμός του Kullback–Leibler divergence για το 
% (a) Degree Centrality

% D_KL_all:στο στοιχείο 
P1 = ones(1, 300) / 300;
D_KL_all=[];
for k=10:150
    connections = num2cell(subarrays{k}(:,1:2));
    
    unique_names = unique([connections{:}]);
    N = length(unique_names) ;
    name_to_id_map = containers.Map(unique_names, 1:length(unique_names));
    
    W = zeros(length(unique_names));
    for i = 1:length(connections)
        user1 = name_to_id_map(connections{i,1});
        user2 = name_to_id_map(connections{i,2});
        W(user1, user2) = 1;
        W(user2, user1) = 1;
    end
    
    G = graph(W);
    degree = centrality(G,'degree','Importance',G.Edges.Weight);
    n = size(W, 1);
    

    max_degree = 300;
    P = zeros(1, max_degree);
    
    for i = 1:max_degree
        P(i) = sum(degree == i) / n;
    end
    
    epsilon = 1e-10;
    P1_adj = P1 + epsilon;
    P_adj = P + epsilon;

    D_KL = sum(P1_adj .* log(P1_adj ./ P_adj));

    D_KL_all = [D_KL_all, D_KL];

    P1 = P;
end

D_KL_all = D_KL_all(2:end);
