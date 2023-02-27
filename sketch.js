let W = window.innerWidth;
let H = window.innerHeight;
const reg_map = new Map();
let reg_data = [];
let log_data = [];
let iter = 1;

let hkcu_base = [W/2, H/2];

function preload() {
  reg_data = loadStrings('datapoints.txt');
  log_data = loadStrings('parsed_log.txt');
}

function setup() {
  createCanvas(W, H);
  background(0);
  create_hashmap();
  console.log(reg_map.get("HKEY_CURRENT_USER\\Software\\Classes"));
}

function create_hashmap() {
  let tmp_line = [];
  let tmp_vals = [];
  for (let i = 0; i < reg_data.length; i++) {
    tmp_line = reg_data[i].split(",");
    tmp_vals = [int(tmp_line[1]), int(tmp_line[2]), int(tmp_line[3])];
    reg_map.set(tmp_line[0], tmp_vals);
  }
}

function get_subpaths(path) {
  let subpaths = [];
  let nodes = path.split("\\");
  nodes[0] = "HKEY_CURRENT_USER";

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
    subpaths.push(tmp);
  }
  return subpaths;
}

function get_points(subpaths) {
  let points = [];
  let max_d = Math.sqrt(W*W + H*H);

  if (subpaths[0] == "HKEY_CURRENT_USER") {
    points[0] = hkcu_base;
  }
  for (let i = 1; i < subpaths.length; i++) {
    let vals = reg_map.get(subpaths[i]);

    if (vals === undefined) {
      console.log(subpaths[i]);
      break;
    }

    let d = max_d/(2*vals[2]);
    let angles = Math.PI / vals[1];
    let theta = vals[0] * angles;

    let x = points[i-1][0] + d*Math.cos(theta);
    let y = points[i-1][1] + d*Math.sin(theta);

    points.push([x, y]);
  }
  return points;
}

function draw() {
  background(0);
  if (iter % log_data.length != 0) {
    let key_path = log_data[iter].split(";")[2];
    let root = key_path.split("\\")[0];
    if (root == '"HKCU' || root == '"HKCU"') {
      let subpaths = get_subpaths(key_path);
      let points = get_points(subpaths);

      stroke(255);
      for (let i = 0; i < points.length-1; i++) {
        line(points[i][0], points[i][1], points[i+1][0], points[i+1][1]);
      }
    }
    iter += 1;
  }
  iter = (iter+1)%log_data.length+1;
}