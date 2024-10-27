function JC = compute_Jaccars_Coefficient(W,neighbor_set)

    num_nodes = size(W, 1);
    JC = zeros(num_nodes);
    for u = 1:num_nodes
        for v = u+1:num_nodes
            %Υπολογίζουμε τους κοινούς γείτονες(Τομή). To numel είναι το πλήθος
            intersection = numel(intersect(neighbor_set{u}, neighbor_set{v}));
            %υπολογίζουμε την ένωση.
            union_set = numel(union(neighbor_set{u}, neighbor_set{v}));
            JC(u,v) = intersection / union_set;
            JC(v,u) = JC(u,v); % Ο πίνακας είναι συμμετρικός
        end
    end
end
