def get_parent_path(path):
    path_parts = path.split("\\")
    parent_path = ""
    for i in range(len(path_parts)-1):
        if i == len(path_parts)-2:
            parent_path += path_parts[i]
        else:
            parent_path += path_parts[i]+"\\"
    
    return parent_path

def get_sibling_info(path_data, current_path, parent_path):
    for i in range(len(path_data)):
        if parent_path == path_data[i][0]:
            siblings = path_data[i][1].split(";")
            num_sibs = len(siblings)
            index = 0

            for j in range(len(siblings)):
                if current_path == siblings[j]:
                    index = j
                    break
            
            return [index, num_sibs]
    return [0,0]

def get_max_path_len(path_data, current_path):
    max_len = 0
    for i in range(len(path_data)):
        l = len(current_path)
        substring = path_data[i][0][0:l]
        if current_path == substring:
            num_nodes = len(path_data[i][0].split("\\"))
            if num_nodes >= max_len:
                max_len = num_nodes

    return max_len

def main():
    datapoints = open("datapoints.txt", "w")
    path_data = []

    with open("hkcu_keytable.txt") as file:
        for line in file:
            path_info = line.split("|")
            path = path_info[0]
            children = path_info[1]
            path_data.append([path, children])

    data_points = []
    for i in range(len(path_data)):
        current_path = path_data[i][0]
        pp = get_parent_path(current_path)
        sib_info = get_sibling_info(path_data, current_path, pp)
        max_path_len = get_max_path_len(path_data, current_path)
        data_points.append([current_path, sib_info[0], sib_info[1], max_path_len])
        
        data = ''
        for j in range(4):
            if j < 3:
                data += str(data_points[i][j])+","
            else:
                data += str(data_points[i][j])+"\n"

        datapoints.write(data)


    datapoints.close()

if __name__ == "__main__":
    main()