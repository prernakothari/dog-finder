(this["webpackJsonpdog-finder"]=this["webpackJsonpdog-finder"]||[]).push([[0],{175:function(e,t,n){},176:function(e,t,n){},475:function(e,t,n){},476:function(e,t,n){},480:function(e,t,n){"use strict";n.r(t);var r=n(6),a=n(0),o=n.n(a),c=n(9),i=n.n(c),s=(n(175),n(176),n(79)),d=n(80),u=n(90),l=n(88),h=(n(177),n(486)),b=n(39),p=n(31),j=n(28),g="SET_URL_LIST",f="APPEND_URL_LIST",v="SET_BREED_DATA",O="SET_ROW_MAP",m="SET_CURRENT_BREED",B={urlList:Object(p.b)([]),breedData:{},rowMap:Object(p.a)(),activeBreedData:{breed:"pug",subBreed:null},hasMoreImages:!0};var x=n(81),L=Object(x.b)((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:B,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case g:return Object(j.a)(Object(j.a)({},e),{},{urlList:Object(p.b)(t.urlList)});case f:var n=e.urlList.union(t.urlList),r=n.size>e.urlList.size;return Object(j.a)(Object(j.a)({},e),{},{urlList:n,hasMoreImages:r});case v:return Object(j.a)(Object(j.a)({},e),{},{breedData:t.breedData});case O:return Object(j.a)(Object(j.a)({},e),{},{rowMap:t.rowMap});case m:return Object(j.a)(Object(j.a)({},e),{},{activeBreedData:{breed:t.breed,subBreed:t.subBreed}})}return B})),M=(n(475),n(169)),w=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return null!==t?"https://dog.ceo/api/breed/".concat(t,"/").concat(null===n?"":"".concat(n,"/"),"images/random/").concat(e):"https://dog.ceo/api/breeds/image/random/".concat(e)},I=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;fetch(w(e,t,n)).then((function(e){return e.json()})).then((function(e){return L.dispatch({type:g,urlList:e.message})})).catch((function(e){console.log("Error:",e)}))},y=function(){return.985*window.innerWidth},S=function(){return Math.min(Math.floor(y()/200),5)},C=function(e){L.dispatch({type:O,rowMap:e})},E=function(e){Object(u.a)(n,e);var t=Object(l.a)(n);function n(e){var r;return Object(s.a)(this,n),(r=t.call(this,e)).reformat=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:void 0,o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:void 0;e.preventDefault();var c,i=r.props.rowMap;if(t){c=i;var s=i.getIn([n,"indicesLoaded"],Object(p.c)([])).add(a);c=c.delete(n),s.forEach((function(e){c=r.addWidthToMap(document.getElementById("image".concat(e)),n.toString(),e,o,c)}))}else{c=Object(p.a)();for(var d=0;d<r.props.urlList.length;d++){var u=S(),l=Math.floor(d/u),h=u;l===Math.floor((r.props.urlList.length-1)/u)&&(h=r.props.urlList.length-u*l),c=r.addWidthToMap(document.getElementById("image".concat(d)),l.toString(),d,h,c)}}C(c)},r.loadMoreImages=function(){!function(e,t){fetch(w(e,t,arguments.length>2&&void 0!==arguments[2]?arguments[2]:null)).then((function(e){return e.json()})).then((function(e){return L.dispatch({type:f,urlList:e.message})})).catch((function(e){console.log("Error:",e)}))}(30,r.props.currentBreed,r.props.currentSubBreed)},r.addWidthToMap=function(e,t,n,a){var o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:void 0,c=o||r.props.rowMap;c.has(t)||(c=c.set(t,{width:0}));var i=c.getIn([t,"indicesLoaded"],Object(p.c)([]));if(!i.has(n)){if((c=(c=c.updateIn([t,"width"],(function(t){return t+e.clientWidth}))).setIn([t,"indicesLoaded"],i.add(n))).getIn([t,"indicesLoaded"]).size===a){var s=e.clientHeight/window.innerWidth*100*(y()/c.getIn([t,"width"]));c=c.setIn([t,"height"],s)}if(void 0!==o)return c;C(c)}},r.state={showImageModal:!1,selectedImageId:null},r}return Object(d.a)(n,[{key:"componentDidMount",value:function(){I(30,this.props.currentBreed,this.props.currentSubBreed),window.addEventListener("resize",this.reformat)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.reformat)}},{key:"render",value:function(){for(var e=this,t=[],n=function(n){var a=Math.floor(n/S()),o=30,c=S(),i=c;a===Math.floor((e.props.urlList.length-1)/c)&&(i=e.props.urlList.length-c*a),e.props.rowMap.hasIn([a.toString(),"height"])&&(o=e.props.rowMap.getIn([a.toString(),"height"])),t.push(Object(r.jsx)("img",{id:"image".concat(n),src:e.props.urlList[n],onClick:function(){e.setState({selectedImageId:n}),e.setState({showImageModal:!0})},style:{height:"".concat(o,"vw"),padding:"0.2%"},onLoad:function(t){return e.reformat(t,!0,a.toString(),n,i)}},"image".concat(n)))},a=0;a<this.props.urlList.length;a++)n(a);return Object(r.jsxs)("div",{children:[Object(r.jsx)("div",{className:"flex-container",children:Object(r.jsx)(M.a,{dataLength:this.props.urlList.length,next:this.loadMoreImages,hasMore:this.props.hasMoreImages,loader:Object(r.jsx)("h4",{children:"Loading..."}),endMessage:Object(r.jsx)("p",{style:{textAlign:"center"},children:Object(r.jsx)("b",{children:"Yay! You have seen it all"})}),children:t})}),Object(r.jsxs)(h.a,{show:this.state.showImageModal,onHide:function(){return e.setState({showImageModal:!1})},children:[Object(r.jsx)(h.a.Header,{closeButton:!0}),Object(r.jsx)(h.a.Body,{children:Object(r.jsx)("img",{src:this.props.urlList[this.state.selectedImageId],style:{width:"100%"}})}),Object(r.jsx)(h.a.Footer,{})]})]})}}]),n}(a.Component),D=Object(b.b)((function(e){return{urlList:e.urlList.toJS(),rowMap:e.rowMap,currentBreed:e.activeBreedData.breed,currentSubBreed:e.activeBreedData.subBreed,hasMoreImages:e.hasMoreImages,reformatting:e.reformatting}}),null)(E),k=n(170),T=n(485),W=n(489);n(476);String.prototype.CapitalizeEachWord=function(){return this.toLowerCase().split(" ").map((function(e){return e.charAt(0).toUpperCase()+e.substring(1)})).join(" ")};var z=Object(b.b)((function(e){return{breedData:e.breedData}}),(function(e){return{setCurrentBreed:function(t,n){return e({type:m,breed:t,subBreed:n})}}}))((function(e){var t=Object(a.useState)(""),n=Object(k.a)(t,2),o=n[0],c=n[1],i=new Map,s=function(t){var n=i.get(t);C(Object(p.a)()),e.setCurrentBreed(n.breed,n.subBreed),I(30,n.breed,n.subBreed)},d=[],u=function(t){if(0===e.breedData[t].length){var n="".concat(t).CapitalizeEachWord();i.set(n,{breed:t,subBreed:null}),d.push(Object(r.jsx)(T.a.Item,{eventKey:n,onSelect:s,onClick:function(){c(n)},children:n},n))}else e.breedData[t].forEach((function(e){var n="".concat(t).CapitalizeEachWord();i.has(n)||(i.set(n,{breed:t,subBreed:null}),d.push(Object(r.jsx)(T.a.Item,{eventKey:n,onSelect:s,onClick:function(){c(n)},children:n},n))),n="".concat(e," ").concat(t).CapitalizeEachWord(),i.set(n,{breed:t,subBreed:e}),d.push(Object(r.jsx)(T.a.Item,{eventKey:n,onSelect:s,onClick:function(){c(n)},children:n},n))}))};for(var l in e.breedData)u(l);return 0===(d=d.filter((function(e){return!o||e.props.children.toLowerCase().includes(o.toLowerCase())}))).length&&d.push(Object(r.jsx)(T.a.Item,{children:"No Results "})),Object(r.jsxs)(T.a,{title:"Select Breed",value:o,children:[Object(r.jsx)(W.a,{autoFocus:!0,className:"mx-2 my-2 w-auto",placeholder:"Filter by Breed",onChange:function(e){return c(e.target.value)},value:o}),d]})})),_=n(487),R=n(488),A=function(e){Object(u.a)(n,e);var t=Object(l.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(d.a)(n,[{key:"componentDidMount",value:function(){fetch("https://dog.ceo/api/breeds/list/all").then((function(e){return e.json()})).then((function(e){return L.dispatch({type:v,breedData:e.message})})).catch((function(e){console.log("Error:",e)}))}},{key:"render",value:function(){var e="".concat(this.props.subBreed?this.props.subBreed+" ":"").concat(this.props.breed?this.props.breed:"All Breeds").CapitalizeEachWord();return Object(r.jsx)("div",{children:Object(r.jsxs)(_.a,{bg:"light",expand:"lg",collapseOnSelect:!0,children:[Object(r.jsx)(R.a,{className:"mr-auto",children:Object(r.jsx)(_.a.Brand,{href:"#home",children:"Dog Finder"})}),Object(r.jsx)(R.a,{className:"mr-auto",children:Object(r.jsxs)(_.a.Text,{size:"lg",children:[" ",e," "]})}),Object(r.jsxs)(R.a,{children:[Object(r.jsx)(_.a.Toggle,{"aria-controls":"responsive-navbar-nav"}),Object(r.jsxs)(_.a.Collapse,{id:"basic-navbar-nav",children:[Object(r.jsx)(z,{}),Object(r.jsx)(R.a.Link,{onClick:this.props.setCurrentBreed,children:" Random "}),Object(r.jsx)(R.a.Link,{id:"githubLink",href:"http://motiongenpro.appspot.com/",target:"_blank",children:" \xa0 "})]})]})]})})}}]),n}(a.Component),F=Object(b.b)((function(e){return{breed:e.activeBreedData.breed,subBreed:e.activeBreedData.subBreed}}),(function(e){return{setCurrentBreed:function(){I(30,null,null),e({type:m,breed:null,subBreed:null})}}}))(A);var N=function(){return Object(r.jsxs)("div",{className:"App",children:[Object(r.jsx)(F,{}),Object(r.jsx)(D,{})]})},P=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,490)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,o=t.getLCP,c=t.getTTFB;n(e),r(e),a(e),o(e),c(e)}))};n(479);i.a.render(Object(r.jsx)(b.a,{store:L,children:Object(r.jsx)(o.a.StrictMode,{children:Object(r.jsx)(N,{})})}),document.getElementById("root")),P()}},[[480,1,2]]]);
//# sourceMappingURL=main.df03ddf6.chunk.js.map