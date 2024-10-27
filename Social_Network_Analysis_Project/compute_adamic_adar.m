function SJC = compute_adamic_adar(W ,neighbors_set)
    num_nodes = size(W, 1);
    SJC = zeros(num_nodes);

    for u = 1:num_nodes
        for v = u+1:num_nodes
            common_neighbors = intersect(neighbors_set{u}, neighbors_set{v});
            
            adamic_adar_value = 0;
            if ~isempty(common_neighbors)
                for z = common_neighbors
                    degree_z = numel(neighbors_set{z});
                    if degree_z > 1
                    adamic_adar_value = adamic_adar_value + (1 / log(degree_z));
                    end
                end
            end 
            
            SJC(u, v) = adamic_adar_value;
            SJC(v, u) = adamic_adar_value; % Ο πίνακας είναι συμμετρικός
        end
    end
end