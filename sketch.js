let W = window.innerWidth;
let H = window.innerHeight;
const reg_map = new Map();
let reg_data = [];
let log_data = [];
let iter = 1;

function preload() {
  reg_data = loadStrings('hk_datapoints.txt');
  log_data = loadStrings('word_open_procmon.txt');
}

function setup() {
  createCanvas(W, H);
  background(0);
  create_hashmap();
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

function draw() {
  background(0);
  //frameRate(2);
  let complete = round((iter / log_data.length) * 100, 2);
  textSize(32);
  text(str(complete)+'%', 10, 30);
  if (iter % log_data.length != 0) {
    let b;
    let key_path = log_data[iter].split(";")[1];
    let root = key_path.split("\\")[0];

    if (root == '"HKCU' || root == '"HKCU"') {
      //b = new Branch(key_path, 0, 0);
      b = new Grid(key_path, 0);
    } else if (root == '"HKLM' || root == '"HKLM"') {
      //b = new Branch(key_path, 2*PI/3, 1);
      b = new Grid(key_path, 1);
    } else if (root == '"HKCR' || root == '"HKCR"'){
      //b = new Branch(key_path, PI, 2);
      b = new Grid(key_path, 2);
    }

    if (b == undefined) {
      let x = 1;
    } else {
      b.show();
    }
  
    iter += 1;
  }
  iter = (iter+1)%log_data.length+1;
}
