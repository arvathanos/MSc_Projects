function CN = compute_common_neighbors(W,neighbor_set)
    num_nodes = size(W, 1);
    CN = zeros(num_nodes);

    for u = 1:num_nodes
        for v = u+1:num_nodes
            common_neighbors = intersect(neighbor_set{u}, neighbor_set{v});
            CN_value = numel(common_neighbors);
            
            CN(u, v) = CN_value;
            CN(v, u) = CN_value; % Ο πίνακας είναι συμμετρικός
        end
    end
end