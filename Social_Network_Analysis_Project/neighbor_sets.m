%Υπολογισμός των γειτόνων για κάθε κόμβο

function neighbor_sets = neighbor_sets(W,common_nodes)
num_common_nodes = length(common_nodes);
neighbor_sets = cell(num_common_nodes, 1);
for i = 1:num_common_nodes
    neighbors_i = find(W(i, :) == 1);
    neighbor_sets{i} = neighbors_i;
end