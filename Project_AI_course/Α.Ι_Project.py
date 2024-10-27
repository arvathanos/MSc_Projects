import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from queue import PriorityQueue
import random

# Define the grid size
ROW_COUNT = 30
COL_COUNT = 40
#percentage % of seats occupied
occupied_spots_per_100 = 50
# Define start and goal points
start = (9, 0)
goal1= (23, 17)
goal2=(23, 21)
goals=[goal1, goal2]


#=============PLOT=================
parking_lot = np.ones((ROW_COUNT, COL_COUNT), dtype=int)  # Initialize with roads (1s)



for i in range(ROW_COUNT):
    for j in range(COL_COUNT):
        # Έλεγχος αν το i, j είναι στην περιφέρεια του ορθογωνίου
        if i == 0 or j == 0 or i == ROW_COUNT - 1 or j == COL_COUNT - 1:
            # Αν ναι, θέτουμε την τιμή σε 0
            parking_lot[i][j] = 0       
        

rows = ROW_COUNT
cols = COL_COUNT
    
i=0
j=0
while i<rows:
        parking_lot[i][0] = 3
        parking_lot[i][1] = 3
        parking_lot[i][cols-1]=3
        parking_lot[i][cols-2]=3
        
        i+=2

while j<cols:
        parking_lot[0][j] = 3
        parking_lot[1][j] = 3
        parking_lot[rows-1][j] = 3
        parking_lot[rows-2][j] = 3
        if rows>=30 :
            for a in [round(rows/4) , round(rows/4 *3)]:
                if j >3 and j<cols-4:        
                    parking_lot[a-3][j]=3
                    parking_lot[a-2][j]=3
                    parking_lot[a-1][j]=3
                    parking_lot[a][j]=3
                    parking_lot[a+1][j]=3
                    parking_lot[a+2][j]=3     
        else:
            a = round(rows/2)
            if j >3 and j<cols-4:        
                parking_lot[a-3][j]=3
                parking_lot[a-2][j]=3
                parking_lot[a-1][j]=3
                parking_lot[a][j]=3
                parking_lot[a+1][j]=3
                parking_lot[a+2][j]=3  
        j+=2
        
if ROW_COUNT>= 30:
    for j in range(5,cols-5,2):
            a = round(rows/4)
            parking_lot[a-2][j]=0
            parking_lot[a+1][j]=0
            a = round(rows/4 *3)
            parking_lot[a-2][j]=0
            parking_lot[a+1][j]=0
            j+=2
        
    z=4
    while z<cols-5:
        a = round(rows/4)
        parking_lot[a-1][z]=3
        parking_lot[a][z]=3
        a = round(rows/4 *3)
        parking_lot[a-1][z]=3
        parking_lot[a][z]=3
        if z != cols/2 - 2 and z != cols/2 -1 and z != cols/2 :
            a = round(rows/2)
            parking_lot[a - 1][z] = 3
            parking_lot[a][z] = 3
        z+=1
else :
    for j in range(5,cols-5,2):
            a = round(rows/2)
            parking_lot[a-2][j]=0
            parking_lot[a+1][j]=0
            parking_lot[a-1][j]=3
            parking_lot[a][j]=3
            j+=2
    

    
available_spots = []

# Identify available parking spots
for i in range(ROW_COUNT):
    for j in range(COL_COUNT):
        if parking_lot[i, j] == 0:
            available_spots.append((i, j))

# Number of occupied spots
num_occupied_spots = round(occupied_spots_per_100/100 * np.sum(parking_lot== 0))# Adjust the number of occupied spots


# Randomly select occupied spots from available spots
occupied_spots = []
while len(occupied_spots) < num_occupied_spots and available_spots:
    selected_spot = random.choice(available_spots)
    occupied_spots.append(selected_spot)
    available_spots.remove(selected_spot)

# Mark occupied spots as 2
for spot in occupied_spots:
    parking_lot[spot[0], spot[1]] = 2

print(parking_lot)

#=============Stop PLOT=================



def weighted_heuristic(a, b, node_costs):
    # Extract node coordinates
    x1, y1 = a
    x2, y2 = b
    
    # Calculate Euclidean distance between nodes
    distance = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
    
    # Adjust distance based on node costs
    # For example, you might assign higher costs to obstacles (3s)
    cost_multiplier = 1.0  # Default cost multiplier for regular nodes (1s)
    if node_costs[b[0], b[1]] == 3:  # Obstacle node
        cost_multiplier = 100.0  # Adjust this value based on the importance of avoiding obstacles
    elif node_costs[b[0], b[1]] == 2:  # Occupied node
        cost_multiplier = 200.0   # Adjust this value based on the importance of avoiding occupied nodes
    
    # Apply the cost multiplier to the distance
    weighted_distance = distance * cost_multiplier
    
    return weighted_distance

def astar_search(start, goals, parking_lot):
    # Check if the first goal is occupied
    if parking_lot[goals[0]] == 2:
        # Check if the second goal is also occupied
        if parking_lot[goals[1]] == 2:
            print("Both goals are occupied, cannot proceed.")
            return None, None
        else:
            print("First goal is occupied, switching to the second goal...")
            goals[0] = goals[1]  # Switch to the second goal
    elif parking_lot[goals[1]] == 2 :
            goals[1] = goals[0]  # Switch to the second goal

    # Calculate the distances to each goal
    distance_to_goal1 = abs(start[0] - goals[0][0]) + abs(start[1] - goals[0][1])
    distance_to_goal2 = abs(start[0] - goals[1][0]) + abs(start[1] - goals[1][1])

    # Choose the nearest goal as the target
    target_goal = goals[0] if distance_to_goal1 <= distance_to_goal2 else goals[1]

    frontier = PriorityQueue()
    frontier.put(start, 0)
    came_from = {}
    cost_so_far = {}
    came_from[start] = None
    cost_so_far[start] = 0

    while not frontier.empty():
        current = frontier.get()

        if current == target_goal:
            break

        for next_node in neighbors(current,goals[1], parking_lot):
            new_cost = cost_so_far[current] + 1
            if next_node not in cost_so_far or new_cost < cost_so_far[next_node]:
                cost_so_far[next_node] = new_cost
                priority = new_cost + weighted_heuristic(current, next_node, parking_lot)
                frontier.put(next_node, priority)
                came_from[next_node] = current

    return came_from, cost_so_far





def neighbors(current, goal, parking_lot):
    ROW_COUNT, COL_COUNT = parking_lot.shape  # Get the dimensions of the parking lot
    row, col = current
    candidates = [(row + 1, col), (row - 1, col), (row, col + 1), (row, col - 1)]
    valid_neighbors = [(r, c) for r, c in candidates if 0 <= r < ROW_COUNT and 0 <= c < COL_COUNT
                       and parking_lot[r, c] != 3]  # Avoid obstacles

    # If both goals are occupied, prioritize nodes around goal 2
    if parking_lot[goal[0], goal[1]] == 2:
        valid_neighbors.sort(key=lambda neighbor: abs(neighbor[0] - goal[0]) + abs(neighbor[1] - goal[1]))

    return valid_neighbors


def reconstruct_path(came_from, start, goal):
    current = goal
    path = []
    while current != start:
        path.append(current)
        current = came_from[current]
    path.append(start)
    path.reverse()
    return path

print("Available parking spots", available_spots)


# Run A* search
came_from, cost_so_far = astar_search(start, goals, parking_lot)

# Choose the closer goal
if goals[0] in came_from and goals[1] in came_from :
    distance_to_goal1 = cost_so_far[goals[0][0], goals[0][1]]
    distance_to_goal2 = cost_so_far[goals[1][0], goals[1][1]]
    if distance_to_goal1 < distance_to_goal2:
        goal = goals[0]
    else:
        goal = goals[1]
elif goals[0] in came_from:
    goal = goals[0]
elif goals[1] in came_from:
    goal = goals[1]
else:
    print("No path found to either goal.")

# Reconstruct path
if goal in came_from:
    path = reconstruct_path(came_from, start, goal)
    print("Path found:", path)
else:
    print("No path found.")



fig, ax = plt.subplots()


def update(frame, goals, goal1, goal2):
    goal1, goal2 = goals
    global path, cost_so_far, parking_lot


    # Προσθέστε τον κώδικα για τη δημιουργία του χάρτη και την απεικόνιση των goals και του path
    ax.set_xlim(-1, COL_COUNT)
    ax.set_ylim(-1, ROW_COUNT)
    for i in range(ROW_COUNT + 1):
        ax.plot([-0.5, COL_COUNT - 0.5], [i - 0.5, i - 0.5], color='gray', linestyle='-', linewidth=0.5)
    for j in range(COL_COUNT + 1):
        ax.plot([j - 0.5, j - 0.5], [-0.5, ROW_COUNT - 0.5], color='gray', linestyle='-', linewidth=0.5)
    for i in range(ROW_COUNT):
        for j in range(COL_COUNT):
            if parking_lot[i][j] == 0:  # Available spots (parking)
                ax.add_patch(plt.Rectangle((j - 0.5, i - 0.5), 1, 1, color='black'))
            elif parking_lot[i][j] == 2:  # Occupied spots
                ax.add_patch(plt.Rectangle((j - 0.5, i - 0.5), 1, 1, color='red'))
            elif parking_lot[i][j] == 3:  # Obstacles
                ax.add_patch(plt.Rectangle((j - 0.5, i - 0.5), 1, 1, color='gray'))

    if path and frame < len(path):
        ax.plot([pos[1] for pos in path[:frame + 1]], [pos[0] for pos in path[:frame + 1]], 'bo-', markersize=6,
                linewidth=1, alpha=0.7)
        if cost_so_far is not None:  # Ensure cost_so_far is not None
            distance = cost_so_far[path[frame][0], path[frame][1]]
            ax.set_title(f"Step {frame + 1} - Distance: {distance:.2f}")
    else:
        # Προσθέστε τον κώδικα για την επεξεργασία του τελικού frame
        if path and np.array_equal(path[-1], goal1):  # Check if the primary goal is reached
            ax.plot(goal1[1], goal1[0], 'go', markersize=6)
            if cost_so_far is not None:  # Ensure cost_so_far is not None
                distance = cost_so_far[goal1[0], goal1[1]]
                ax.set_title(f"Goal 1 Reached - Total Distance: {distance:.2f}")
        elif path and np.array_equal(path[-1], goal2):  # Check if the secondary goal is reached
            ax.plot(goal2[1], goal2[0], 'yo', markersize=6)
            if cost_so_far is not None:  # Ensure cost_so_far is not None
                distance = cost_so_far[goal2[0], goal2[1]]
                ax.set_title(f"Goal 2 Reached - Total Distance: {distance:.2f}")
        else:
            ax.plot(goal1[1], goal1[0], 'go', markersize=6)
            if cost_so_far is not None:  # Ensure cost_so_far is not None
                distance = cost_so_far[goal1[0], goal1[1]]
                ax.set_title(f"Goal Not Reached - Total Distance to Goal 1: {distance:.2f}")
                # Check if goal 1 is occupied
                if parking_lot[goal1[0]][goal1[1]] == 2:
                    ax.text(goal1[1], goal1[0], 'Goal 1 Occupied!', color='red', ha='center')
                    # Check if goal 2 is available
                    if parking_lot[goal2[0]][goal2[1]] == 0:
                        ax.plot(goal2[1], goal2[0], 'yo', markersize=6)
                        distance = cost_so_far[goal2[0], goal2[1]]
                        ax.set_title(f"Goal 1 Occupied - Goal 2 Available - Total Distance to Goal 2: {distance:.2f}")
                        # Recalculate path to goal 2
                        came_from, cost_so_far = astar_search(path[-1], goal2, parking_lot)
                        path = reconstruct_path(came_from, path[-1], goal2)
                        ax.plot([pos[1] for pos in path], [pos[0] for pos in path], 'bo-', markersize=6,
                                linewidth=1, alpha=0.7)
                    else:
                        ax.text(goal2[1], goal2[0], 'Goal 2 Occupied!', color='red', ha='center')
                        raise ValueError("Both goals are occupied. Cannot proceed with the algorithm.")



# # Animate the path
ani = FuncAnimation(fig, update, frames=len(path) + 1, fargs=(goals,goals[0],goals[1]), interval=1000, repeat=False)
ani.save('parking_lot.gif', writer='Pillow', fps=1)

plt.show()


