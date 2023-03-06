class Branch {
    constructor(key_path, theta, hive_num) {
        this.key_path = key_path;
        this.theta = theta;
        this.hive_num = hive_num;

        this.subpaths = [];
        this.points = [];

        this.get_subpaths();
        this.get_points();
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
    get_points() {
        let max_d = Math.sqrt(W*W + H*H);
      
        this.points[0] = [W/2, H/2, this.theta];
        for (let i = 1; i < this.subpaths.length; i++) {
            let vals = reg_map.get(this.subpaths[i]);
      
            if (vals === undefined) {
                if (this.points.length > 2) {
                    fill(this.hive_num, 0, 1);
                    ellipse(this.points[i-1][0], this.points[i-1][1], 5);
                }
                return;
            }

            let d = max_d/(2*vals[2]);
            let angles = Math.PI / (vals[1]);
            let sigma;

            if (i > 1) {
                sigma = vals[0] * angles + this.points[i-1][2] - this.points[i-2][2];
            } else {
                sigma = vals[0] * angles + this.points[i-1][2];
            }
      
            let x = this.points[i-1][0] + d*Math.cos(sigma);
            let y = this.points[i-1][1] + d*Math.sin(sigma);
      
            this.points.push([x, y, vals[0] * angles + this.points[i-1][2]]);
        }
    }
    show() {
        colorMode(HSB, 3, this.points.length, 1);
        for (let i = 0; i < this.points.length-1; i++) {
            stroke(this.hive_num, this.points.length-i, 1);
            strokeWeight(3*(this.points.length-i)/this.points.length);
            line(this.points[i][0], this.points[i][1], this.points[i+1][0], this.points[i+1][1]);
        }  
    }
}
