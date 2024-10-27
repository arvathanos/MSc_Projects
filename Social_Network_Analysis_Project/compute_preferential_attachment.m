function PA = compute_preferential_attachment(W,neighbor_set)
    num_nodes = size(W, 1);
    PA = zeros(num_nodes);

    for u = 1:num_nodes
        for v = u+1:num_nodes
            PA_value = numel(neighbor_set{u}) * numel(neighbor_set{v});
            PA(u, v) = PA_value;
            PA(v, u) = PA_value; % Ο πίνακας είναι συμμετρικός
        end
    end
end