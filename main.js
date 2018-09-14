$("#3d-graph").on("mouseleave", function(){
    hovering = false;
});

function updateGeometries() {
    Graph.nodeRelSize(4); // trigger update of 3d objects in scene
}

document.getElementById("next_graph").style.backgroundColor = "grey";

function openPage(pageName,elmnt,color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
    elmnt.style.backgroundColor = color;
}
// Get the element with id="defaultOpen" and click on it



//converts hex to rgb decimal sum
function hexToNumber(h){
    var r = parseInt(h.slice(1,3),16),
        g = parseInt(h.slice(3,5),16),
        b = parseInt(h.slice(5,7),16);
    return r+g+b;
}

var highlightNodes = [],
    highlightLink = [],
    selectedNodes = [],
    selectedLink = [],
    chosenNodes = [],
    chosenLink = [],
    activeNode,
    camera_toggle = false,
    toggle = 0;

var no_profile = "img/profile.png";
document.getElementById("profile").setAttribute("src", no_profile);
$("#info").css("border-color", "grey");

var Graph;

function toggle_direct(){
    var direct_button = document.getElementById("direct");
    if(toggle == 0) {
        toggle = 1;
        direct_button.setAttribute("class", "button direct");
    } else {
        toggle = 0;
        direct_button.setAttribute("class", "button direct inactive");
    }
    Graph.linkDirectionalParticles(link => (toggle == 1) ? link.directed*10 : null);
}

function shape(node){
    if(node.shape == "Cube"){
        var square = new THREE.BoxGeometry(10+ node.size/5,10+ node.size/5,10+ node.size/5,10+ node.size/5);
        return square;
    }   else if (node.shape == "Tetra"){
        var tetra = new THREE.TetrahedronGeometry(5+ node.size/5, 0);
        return tetra;
} else if (node.shape == "Octa"){
        var octa = new THREE.OctahedronGeometry(5+ node.size/5, 0);
        return octa;
}else if (node.shape == "Dode"){

    var dode =  new THREE.DodecahedronGeometry(5+ node.size/5);
    return dode;
} else {
        var sphere = new THREE.SphereGeometry(5+ node.size/5);
        return sphere;
}
}

document.getElementById("camera").onclick = function(){
        camera_toggle = !camera_toggle;
        if(camera_toggle){
            showNode(activeNode);
        } else {
            resetCamera(object.graphData());
        }
    }


var nodeLost = false;
var hovering = false;
var onGraph = false;
var inTransit = false;

$("#3d-graph")
    .mouseover(function(){
    onGraph = true;

    })
    .mouseout(function(){
    onGraph = false;
    updateGeometries();

});


function build_graph(graph){
    
    var win = $(this); //this = window

    //if(activeNode == null) {activeNode = graph.nodes[0];}

    
    
    

    //activeNode = graph1.nodes[0];
   // } 
    
//    document.getElementById(activeNode.id).scrollIntoView({behavior: "smooth"});
    const elem = document.getElementById('3d-graph');
    var w = elem.offsetWidth;
    Graph = ForceGraph3D()(elem)
    //.height(900)
    //.cameraPosition({x:0, y:0, z: Math.cbrt(graph.nodes.length) * 150},{x:0,y:0,z:0})
    
        //.backgroundColor("#ffffff")
        //.linkWidth(1)
        .nodeThreeObject(( node ) => new THREE.Mesh(
    shape(node),
       
        new THREE.MeshLambertMaterial({
            color: node.color,
            transparent: true,
            opacity: ((onGraph && !inTransit) ? !hovering ? node==activeNode ? 1 : 0.7 : highlightNodes.includes(node) ? 0.8 : 0.2: 0.7)
          })
   ))
    .linkMaterial(( link ) => 
        new THREE.MeshLambertMaterial({
            color: link.color,
            transparent: true,
            opacity: ((onGraph && !inTransit) ? !hovering ? 0.5 : highlightLink.includes(link) ? 0.8 : 0.2 : 0.5)
          })
    )
    //.nodeResolution(100)
    //.linkResolution(100)
    .nodeLabel('label')
    //.nodeAutoColorBy('group')
    .enableNodeDrag(false)
    .showNavInfo(false)
    .nodeOpacity(1)
    .width(w)
    .height(win.height()*0.74)
    //.linkDirectionalParticles(link => (toggle == 1) ? link.directed*5 : null)
//    .nodeColor(node => chosenNodes.includes(node) ? 'rgb(' + (node.red) + ',' + (node.green) + ',' + (node.blue) + ',0.1)' : highlightNodes.includes(node) ? normalizeColor(node.red,node.green,node.blue,20) : selectedNodes.includes(node) ? normalizeColor(node.red,node.green,node.blue,40) : 'rgb(' + (100) + ',' + (100) + ',' + (100) + ',0.3)')

    //.linkColor(link => chosenLink.includes(link) ? 'rgb(' + (link.red) + ',' + (link.green) + ',' + (link.blue) + ',0.1)' : highlightLink.includes(link) ? normalizeColor(link.red,link.green,link.blue,20) : selectedLink.includes(link) ? normalizeColor(link.red,link.green,link.blue,40) : 'rgb(' + (100) + ',' + (100) + ',' + (100) + ',0.3)')
    //.linkDirectionalParticleWidth(link => `${link.weight/4+1}`)
    .nodeVal(node => 1+ node.size/3)
    .linkWidth(link => 1+ link.weight/3)
    //.linkDirectionalParticles(link => link === highlightLink[0] ? 4 : 0)
    //.linkDirectionalParticleWidth(4)
    .onNodeHover(node => {
      // no state change
        elem.style.cursor = node ? 'pointer' : null;

        if(object.graphData().links.length < 1000){
            if ((!node && !highlightNodes.length) || (highlightNodes.length === 1 && highlightNodes[0] === node)) return;
       var links = [];
        var nodes = [];
        for(var j = 0;j < Graph.graphData().links.length; j++){
            if(Graph.graphData().links[j].source == node || Graph.graphData().links[j].target == node){
                links.push(Graph.graphData().links[j]);
                nodes.push(Graph.graphData().links[j].source);
                nodes.push(Graph.graphData().links[j].target);
            }
        }
        nodes.push(node);
        elem.style.cursor = node ? 'pointer' : null;
        hovering = node ? true : false;
        Graph.enableNavigationControls(node ? false : true);
        //if(node){highlightNodes.push(node)} else 
        highlightNodes = nodes;
        highlightLink = links;
            if(onGraph && !inTransit)updateGeometries();
        }
        node ? showPoint(node) : showPoint(activeNode);
        node ? changeInfo(node) : changeInfo(activeNode);
        
    })
    .onLinkHover(link => {
      // no state change
        if (highlightLink[0] === link) return;
        elem.style.cursor = link ? 'pointer' : null;
        Graph.enableNavigationControls(link ? false : true);
        hovering = link ? true : false;

        highlightLink = [link];
        highlightNodes = link ? [link.source, link.target] : [];
        console.log(hovering);
        if(object.graphData().links.length < 1000){if(onGraph && !inTransit)updateGeometries();}
    }).onNodeClick(node => {
        
        showPoint(node);
        var links = [];
        var nodes = [];
        //if ((!node && !highlightNodes.length) || (highlightNodes.length === 1 && highlightNodes[0] === node)) return;
        for(var j = 0;j < graph.links.length; j++){
            if(graph.links[j].source == node || graph.links[j].target == node){
                links.push(graph.links[j]);
                nodes.push(graph.links[j].source);
                nodes.push(graph.links[j].target);
            }
        }

//        if(chosenNodes.includes(node)){
//             for(var i = 0;i < nodes.length; i++){
//                 var dex = selectedNodes.indexOf(nodes[i]);
//                 selectedNodes.splice(dex,1);
//             }
//            for(var k = 0;k < links.length; k++){
//                 var dex = selectedLink.indexOf(links[k]);
//                 selectedLink.splice(dex,1);
//             }
//            selectedNodes.splice(selectedNodes.indexOf(node),1);
//            chosenNodes.splice(chosenNodes.indexOf(node),1);
//            //Graph.cameraPosition(0,0,100);
//            //$("#"+node.id).remove();
//            //if(node == activeNode){resetCamera(graph);}
//            //removeInfo();
//            return;
//
//        } else{

            changeInfo(node);
if(!chosenNodes.includes(node)){
    newListElement(node,graph,"list");
    chosenNodes.push(node);
}
            
            nodes.push(node);
            //if(node){highlightNodes.push(node)} else 
            selectedNodes = selectedNodes.concat(nodes);
            selectedLink = selectedLink.concat(links);

            updateGeometries();
          // Aim at node from outside it
            if(camera_toggle) showNode(node);
            

            $(".item").css("background-color","#666666");
            document.getElementById(node.id).style.backgroundColor = "#777777";
            activeNode = node;
           document.getElementById(node.id).scrollIntoView({behavior: "smooth"});
        
    }).onLinkClick(link => {
        if(chosenLink.includes(link)){
            selectedNodes.splice(selectedNodes.indexOf(link.source),1);
            selectedNodes.splice(selectedNodes.indexOf(link.target),1);
            selectedLink.splice(selectedLink.indexOf(link),1);
            chosenLink.splice(chosenLink.indexOf(link),1);
            //Graph.cameraPosition(0,0,100);
            return;

        }
        chosenLink.push(link);

        selectedLink = selectedLink.concat(link);
        $(document).ready(function(){



    });
        selectedNodes = selectedNodes.concat([link.source, link.target]);

        const distance = 200;
        var node = link.source;
        const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
        Graph.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition durationGraph
        );

    }).forceEngine("d3").graphData(graph);
    
    Graph.d3Force("link")
      .distance(80);
    Graph.d3Force("charge")
      .strength(-150);
    
   // updateGeometries();
    //changeInfo(activeNode);
        //$(".item").css("background-color","#aaaaaa");
       // document.getElementById(activeNode.id).style.backgroundColor = activeNode.color;
        //activeNode = graph1.nodes[0];
   // activeNode = nodeToShow;
        return Graph;
}

//        function nextGraph(){
//            document.getElementById("thing").innerHTML = "";
//            var tweet_button = document.getElementById("twitter_link");
//            tweet_button.removeAttribute("href");
//            tweet_button.setAttribute("class", "button tweet inactive");
//            var case_button = document.getElementById("case_link");
//            case_button.removeAttribute("href");
//            case_button.setAttribute("class", "button case inactive");
//            document.getElementById("title").innerHTML = 'Click a Node'; 
//            graph_num++;
//            if(graph_num > 1) graph_num = 0;
//            Graph = showGraph(graph_num);
//            if(toggle == 1) toggle_direct();
//        };
//Graph.d3Force('collide', d3.forceCollide(Graph.nodeRelSize(6)));


$("#info").css("background-color","#666666");
function selectItem(n){
    $(".item").css("background-color","#666666");
    $("#"+n.id).css("background-color","#777777");
    changeInfo(n);
    showPoint(n);
    activeNode = n;
    updateGeometries();
    if(camera_toggle) showNode(n);
    
}

function removeInfo(){
    
    document.getElementById("profile").setAttribute("src", no_profile);
    $("#info").css("border-color", "grey");
}

function showPoint(node){
        
        var point_title = document.getElementById("point_title");
        var point_text = document.getElementById("point_text");
        if(node == null){
            point_title.innerHTML = "";
            point_text.innerHTML = "";
            return;
        }
        point_title.innerHTML = node.label;
        point_text.innerHTML =node.description;      
}

function changeInfo(node){
    
    
    
    var image = document.getElementById("profile");
    if(node == null){
        image.setAttribute("src", no_profile);
        $("#info").css("border-color", "grey");
        return;
    }
    
    $("#info").css("border-color", node.color);
    var node_profile = (node.img == "") || (node.img == null) ? no_profile : node.img;
    image.setAttribute("src", (node.img == "") | (node.img == null) ? no_profile : node.img);
    //document.getElementById("show_node").onclick = function() {showNode(node)};
    $("#info").css("border-color", node.color);
  //  activeNode = node;
}

function showNode(node){
    const distance = 200;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    Graph.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
        node, // lookAt ({ x, y, z })
        3000  // ms transition duration
    );
    inTransit = true;
    var time = setTimeout(noHover,3000);
    function noHover(){
        inTransit = false;
        updateGeometries();
    }
    
}



function resetCamera(graph){
    Graph.cameraPosition({x:0, y:0, z: Math.cbrt(graph.nodes.length) * 150},{x:0,y:0,z:0},3000);
}

function removeItem(node,graph){
    var links = [];
    var nodes = [];
    //if ((!node && !highlightNodes.length) || (highlightNodes.length === 1 && highlightNodes[0] === node)) return;
    for(var j = 0;j < graph.links.length; j++){
        if(graph.links[j].source == node || graph.links[j].target == node){
            links.push(graph.links[j]);
            nodes.push(graph.links[j].source);
            nodes.push(graph.links[j].target);
        }
    }
    for(var i = 0;i < nodes.length; i++){
         var dex = selectedNodes.indexOf(nodes[i]);
         selectedNodes.splice(dex,1);
    }
    for(var k = 0;k < links.length; k++){
         var dex = selectedLink.indexOf(links[k]);
         selectedLink.splice(dex,1);
     }
    selectedNodes.splice(selectedNodes.indexOf(node),1);
    chosenNodes.splice(chosenNodes.indexOf(node),1);
    //Graph.cameraPosition(0,0,100);
    $("#"+node.id).remove();
    updateGeometries();
    if(node == activeNode){
        if(camera_toggle){resetCamera(graph);} 
        removeInfo();}
    
}

var graphCount = 0;

var gData;
var node_sheet = "points_" + graphCount;
var link_sheet = "lines_" + graphCount;
var colors = [];
var color_filters_active = [];
var colors_links = [];
var color_filters_active_links = [];
var filter_toggle = 0;
var object;
var graph2 = {"nodes":[],"links":[]};
base(node_sheet).select({
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
        graph2.nodes.push(record.fields);
        
    });
    fetchNextPage();
}, function done(err) {
     graph2.nodes = JSON.parse( JSON.stringify( graph2.nodes ) );
    //console.log(JSON.stringify( nodes ));
    base(link_sheet).select({
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
        graph2.links.push(record.fields);
    });
    fetchNextPage();
}, function done(err) {
     graph2.links = JSON.parse( JSON.stringify( graph2.links ) );
    for(var i = 0; i < graph2.nodes.length; i++){
    
    if(!colors.includes(graph2.nodes[i].color)){
        colors.push(graph2.nodes[i].color);
        
    } 
}

for(var i = 0; i < graph2.links.length; i++){
    
    if(!colors_links.includes(graph2.links[i].color)){
        colors_links.push(graph2.links[i].color);
        
    } 
}
        
        
var x = document.getElementById("color_filters");
var title = document.createElement("div");
title.setAttribute("class", "filterTitle");
title.innerHTML = "Node Color Filters:";
x.appendChild(title); 

for(var i  = 0; i < colors.length; i++){
   newFilter(colors[i],i,"node");
}

var x = document.getElementById("color_filters");
var title = document.createElement("div");
title.setAttribute("class", "filterTitle");
title.innerHTML = "Edge Color Filters:";
x.appendChild(title); 

for(var i  = 0; i < colors_links.length; i++){
   newFilter(colors_links[i],i,"link");
}
        
        
object = build_graph(graph2);
        gData = object.graphData();
   // console.log(JSON.stringify( links ));
    if (err) { console.error(err); return; }
});
    

    if (err) { console.error(err); return; }
});


function newFilter(c,i,type){
    var x = document.getElementById("color_filters");
    var node = document.createElement("button");
    var num = i;
    node.setAttribute("id", c.toString() + type);
    node.style.backgroundColor = c;
    node.setAttribute("class", "button color_filter" + type);
   node.innerHTML = c.toString();
      node.onclick = function() {color_filter(c,num,type)};
    
    if(hexToNumber(c)>340){node.style.color = "#000000";}
    x.appendChild(node);   
     if(type == "node"){
         color_filters_active.push(1);
     } else {
          color_filters_active_links.push(1);
     }
}





var size_value = 0;
var weight_value = 0;

function compareColors(c,cs,a){
    for(var i = 0; i < cs.length; i++){
        if(a[i] == 0 && c == cs[i]){
            return true;
        }
    } return false;
}


function color_filter(c,l,t){
    console.log(gData);
    removeInfo();
        var myNode = document.getElementById("list");
while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);}
    var button = document.getElementById(c+t);
    
    if(t == "node"){
        if(color_filters_active[l] == 1) {
            color_filters_active[l] = 0;
            button.style.backgroundColor = "#555555";
            
        } else {
            color_filters_active[l] = 1;
            button.style.backgroundColor = c;
        }    
    } else {
        if(color_filters_active_links[l] == 1) {
            color_filters_active_links[l] = 0;
            button.style.backgroundColor = "#555555";
        } else {
            color_filters_active_links[l] = 1;
            button.style.backgroundColor = c;
        }
    }
    //if(color_filters_active[l] == 1) {color_filters_active[l] = 0;} else {color_filters_active[l] = 1;}
     var bad_links = [];
    var good_nodes = [];

   

//
//    for(var k = 0; k < bad_links.length; k++){
//        var index = gData.links.indexOf(bad_links[k]);
//        gData.links.splice(index,1);
//    }
//    for(var k = 0; k < bad_nodes.length; k++){
//        //if(bad_nodes[k].id == activeNode.id){activeNode = graph1.nodes[0];}
//        var index = gData.nodes.indexOf(bad_nodes[k]);
//        gData.nodes.splice(index,1);
//    }
    object.graphData(scanData(gData,good_nodes,bad_links,size_value,weight_value));        

    //console.log(JSON.stringify( graph1 ));
    

    
}

function scanData(data,nodes,links,size,weight){
    var graph = {"nodes": [],"links": []};
   
for(var i = 0; i < data.nodes.length; i++){
        


        if(!compareColors(data.nodes[i].color,colors,color_filters_active)  && Number(data.nodes[i].size) >= size){
            //chosenNodes.push(graph1.nodes[i]);
             
            nodes.push(data.nodes[i]);
            
            
        } }
            for(var j = 0; j < data.links.length; j++){
                if(!compareColors(data.links[j].color,colors_links,color_filters_active_links)  && (Number(data.links[j].weight) >= weight) && nodes.includes(data.links[j].source) && nodes.includes(data.links[j].target) && Number(data.links[j].weight) >= weight){
                    links.push(data.links[j]);
                    //console.log(colors_links);
                }
            }  
        
    
    graph.nodes = nodes;
    graph.links = links;
    console.log(graph);
    return graph;
}



var size_slider = document.getElementById("myRange");
size_slider.onmouseup = function() {size_filter(this.value)};


function size_filter(v) { 
    size_value = v;
   removeInfo();
        var myNode = document.getElementById("list");
while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);}
    
    //if(color_filters_active[l] == 1) {color_filters_active[l] = 0;} else {color_filters_active[l] = 1;}
     var bad_links = [];
    var bad_nodes = [];
    console.log(v);
    object.graphData(scanData(gData,bad_nodes,bad_links,v,weight_value));   
}

var weight_slider = document.getElementById("myRange2");
weight_slider.onmouseup = function() {weight_filter(this.value)};


function weight_filter(v) { 
   weight_value = v;
   removeInfo();
        var myNode = document.getElementById("list");
while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);}
    
    //if(color_filters_active[l] == 1) {color_filters_active[l] = 0;} else {color_filters_active[l] = 1;}
     var bad_links = [];
    var bad_nodes = [];

    object.graphData(scanData(gData,bad_nodes,bad_links,size_value,v));
}


function searchGraph() {
       var myNode = document.getElementById("list_search");
while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);}

    
    var search = document.getElementById("search_text");
    
    for(var i = 0; i < gData.nodes.length; i++){
        var text = (gData.nodes[i].description != null ? gData.nodes[i].description : "")
            + (gData.nodes[i].label != null ? gData.nodes[i].label : "")
            + (gData.nodes[i].annotation != null ? gData.nodes[i].annotation : "");
        
    	if(text.includes(search.value)){
        	newListElement(gData.nodes[i],gData,"list_search");
        }
    }
    $(".item").css("background-color","#666666");
}

//function filter(){
//    if(filter_toggle == 0){
//        
//        removeInfo();
//        var myNode = document.getElementById("list");
//while (myNode.firstChild) {
//    myNode.removeChild(myNode.firstChild);
//}
//   // var graph1 = Object.assign({}, data);
//    filter_toggle = 1;
//    var bad_links = [];
//    var bad_nodes = [];
//    var graph1 = JSON.parse( JSON.stringify( data ) );
//
//
//    for(var i = 0; i < graph1.nodes.length; i++){
//        
//        var color = fullColorHex(graph1.nodes[i].red, graph1.nodes[i].green, graph1.nodes[i].blue);
//        var c = fullColorHex(51,153,255);
//        //var c = fullColorHex(0,102,255);
//        if(c == color){
//            //chosenNodes.push(graph1.nodes[i]);
//            if(!(bad_links.includes(graph1.links[j])))bad_nodes.push(graph1.nodes[i]);
//            for(var j = 0; j < graph1.links.length; j++){
//                if(!(bad_links.includes(graph1.links[j])) && (graph1.links[j].source === graph1.nodes[i].id || graph1.links[j].target === graph1.nodes[i].id)){
//                    bad_links.push(graph1.links[j]);
//                }
//            }  
//        }
//    }
//
//
//    for(var k = 0; k < bad_links.length; k++){
//        var index = graph1.links.indexOf(bad_links[k]);
//        graph1.links.splice(index,1);
//    }
//    for(var k = 0; k < bad_nodes.length; k++){
//        if(bad_nodes[k].id == activeNode.id){activeNode = graph1.nodes[0];}
//        var index = graph1.nodes.indexOf(bad_nodes[k]);
//        graph1.nodes.splice(index,1);
//    }
//    object.graphData(graph1);
//       
//    //if(camera_toggle){showNode(graph1.nodes[i]);}
//
//    } else {
//        var myNode = document.getElementById("list");
//while (myNode.firstChild) {
//    myNode.removeChild(myNode.firstChild);
//}removeInfo();
//        filter_toggle = 0;
//        var graph1 = JSON.parse( JSON.stringify( data ) );
//        object.graphData(graph1);
//        
//        //if(camera_toggle){showNode(activeNode);}
//    }
//}




$(window).on('resize', function(){
      var win = $(this); //this = window
    const elem = document.getElementById('3d-graph');
    var w = elem.offsetWidth;
    object.width(w);
    object.height(win.height()*0.74);
    updateGeometries();
});


function newListElement(n,g,feed) {
    
    
    
    var x = document.getElementById(feed);
    var node = document.createElement("li");
    var item_title = document.createElement("div");
    item_title.setAttribute("class", "item_title");
    var item_text = document.createElement("div");
    item_text.setAttribute("class", "item_text");
    var cancel = document.createElement("button");
    cancel.setAttribute("class", "b cancel");
    cancel.onclick = function() {removeItem(n,g)};
    node.setAttribute("id", n.id);
    node.setAttribute("class", "item");
    node.onclick = function() {selectItem(n)};
    node.style.borderColor = n.color;
    item_text.innerHTML = n.description;
    item_title.innerHTML = n.label;
    cancel.innerHTML = "X";
    node.appendChild(item_title);
    node.appendChild(item_text);
    

    node.scrollIntoView();
if(n.case_link != "") {
        var case_button = document.createElement("a");
        case_button.setAttribute("id", n.id + "c_link");
        case_button.setAttribute("href", n.case_link);
        case_button.setAttribute("class", "b case");
        case_button.innerHTML = "CASE";
    node.appendChild(case_button);
    } 
    if(n.twitter_link != null) {
        var tweet_button = document.createElement("a");
        tweet_button.setAttribute("id", n.id + "tweet_link");
        tweet_button.setAttribute("href", n.twitter_link);
        tweet_button.setAttribute("class", "b tweet");
        tweet_button.innerHTML = "POINT";
        node.appendChild(tweet_button);
    } 
    node.appendChild(cancel);
    x.insertBefore(node,x.firstChild);
    
}
var graphMax = 0;

    function findMax(){
        var n_sheet = "points_" + graphMax;
        base(n_sheet).select({
    view: 'Grid view'
}).firstPage(function(err, records) {
    if (err) { 
        if(err.statusCode == 404){
            var button = document.getElementById("next_graph");
            button.style.backgroundColor = "green";
            button.onclick = function() {nextGraph();};
            return 0;
        }else return -1;}
    else {graphMax++; findMax(); console.log(graphMax); }
});
    }
    
    findMax();

//findGraphMax();

function nextGraph() {
    var noNodes = false;
    var noLinks = false;
    graphCount++;
    console.log(graphMax);
    if( graphCount == graphMax) graphCount = 0;
    node_sheet = "points_" + graphCount;
link_sheet = "lines_" + graphCount;
    graph2 = {"nodes":[],"links":[]};
base(node_sheet).select({
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
        graph2.nodes.push(record.fields);
        
    });
    fetchNextPage();
}, function done(err) {
    
     graph2.nodes = JSON.parse( JSON.stringify( graph2.nodes ) );
    //console.log(JSON.stringify( nodes ));
    base(link_sheet).select({
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    records.forEach(function(record) {
        graph2.links.push(record.fields);
    });
    fetchNextPage();
}, function done(err) {
        
     graph2.links = JSON.parse( JSON.stringify( graph2.links ) );
        colors = [];
    for(var i = 0; i < graph2.nodes.length; i++){
    
    if(!colors.includes(graph2.nodes[i].color)){
        colors.push(graph2.nodes[i].color);
        
    } 
}
colors_links = [];
for(var i = 0; i < graph2.links.length; i++){
    
    if(!colors_links.includes(graph2.links[i].color)){
        colors_links.push(graph2.links[i].color);
        
    } 
}


        
var x = document.getElementById("color_filters");

       
while (x.firstChild) {
    x.removeChild(x.firstChild);}
        
var title = document.createElement("div");
title.setAttribute("class", "filterTitle");
title.innerHTML = "Node Color Filters:";
x.appendChild(title); 


for(var i  = 0; i < colors.length; i++){
   newFilter(colors[i],i,"node");
}

var x = document.getElementById("color_filters");
var title = document.createElement("div");
title.setAttribute("class", "filterTitle");
title.innerHTML = "Edge Color Filters:";
x.appendChild(title); 

for(var i  = 0; i < colors_links.length; i++){
   newFilter(colors_links[i],i,"link");
}
        
        
object = build_graph(graph2);
        gData = object.graphData();
   // console.log(JSON.stringify( links ));
    
});
});
   
}

$( function() {
    $( "#list" ).sortable({axis: "y"});
    
    $( "#list" ).disableSelection();
  } );

