class Grid {
    constructor(key_path, hive_num) {
        this.key_path = key_path;
        this.hive_num = hive_num;

        this.subpaths = [];
        this.cells = [];
        this.cell_path = [];

        this.get_subpaths();
        this.get_cells();
    }
    get_subpaths() {
        let nodes = this.key_path.split("\\");
      
        if (nodes[0] == '"HKCU' || nodes[0] == '"HKCU"') {
          nodes[0] = "HKEY_CURRENT_USER";
        }
      
        if (nodes[0] == '"HKLM' || nodes[0] == '"HKLM"') {
          nodes[0] = "HKEY_LOCAL_MACHINE";
        }
      
        if (nodes[0] == '"HKCR' || nodes[0] == '"HKCR"') {
          nodes[0] = "HKEY_CLASSES_ROOT";
        }
      
        for (let i = 0; i < nodes.length; i++) {
            let tmp = "";
            for (let j = 0; j < i+1; j++) {
                if (j == 0) {
                    tmp = tmp.concat(nodes[j]);
                } else {
                    tmp = tmp.concat("\\");
                    tmp = tmp.concat(nodes[j]);
                }
            }
          
            if (tmp.slice(-1) == '"') {
                tmp = tmp.substring(0, tmp.length-1);
            }
            this.subpaths.push(tmp);
        }
    }
    get_cells() {  
        let max_len = 0;  
        this.cells[0] = 3; 
        this.cell_path[0] = this.hive_num;

        for (let i = 1; i < this.subpaths.length; i++) {
            let vals = reg_map.get(this.subpaths[i]);
      
            if (vals === undefined) {
                this.cell_path[this.cell_path.length] = -1;
                break;
            }

            let subpath_nodes = this.subpaths[i].split("\\").length
            if (subpath_nodes > max_len) {
                max_len = subpath_nodes;
            }

            this.cells.push(vals[1]);
            this.cell_path.push(vals[0]);
        }
    }
    show() {
        let padx_ratio = 0.01;
        let pady_ratio = 0.01;
        let padx = (padx_ratio * W) / 2;
        let pady = (pady_ratio * H) / 2;

        let cell_w = (W-2*padx) / this.cells.length;
        colorMode(RGB, 1, 1, 1);
        stroke(0.5, 0.01, 0.8);
        fill(0);
        strokeWeight(0.5);
        for (let i = 0; i < this.cells.length; i++) {
            fill(0);
            let cell_h = (H-2*pady) / this.cells[i];
            for (let j = 0; j < this.cells[i]; j++) {
                let x = padx + i*cell_w;
                let y = pady + j*cell_h;

                if (j == this.cell_path[i]) {
                    if (this.hive_num == 0) {
                        fill(0,0,1);
                    } else if (this.hive_num == 1) {
                        fill(1, 0, 1);
                    } else {
                        fill(0, 1, 1);
                    }
                    
                } else {
                    fill(0);
                }

                rect(x, y, cell_w, cell_h);
                fill(0);
            } 
        }
    }
}
