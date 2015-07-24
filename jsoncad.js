
JSONCad			= function() {};
JSONCad.Viewer	= function(target, o) {
												// Setting up basic options and defaults
  			var this_						=	this,
			 options						=	o							|| {}							;	
 	 		 options.containerElm_			=	options.containerElm_		|| this.initDom(this_)			;
			 options.widthDefault_			=	options.widthDefault_		|| '1600px'						;
			 options.heightDefault_			=	options.heightDefault_		|| '900px'						;
			 options.width_					=	options.width_				|| '1600px'						;
			 options.height_				=	options.height_				|| '900px'						;
 			 options.perspective_			=	options.perspective_		|| 45							;
			 options.drawOptions_			=	options.drawOptions_		|| {lines : false, faces : true};
			 options.defaultColor_			=	options.defaultColor_		|| [ 0, 0, 1   ,1]				;
			 options.bgColor_				=	options.bgColor_			|| [.93,.93,.93,1]				;
   			 options.cameraStart_			=	options.cameraStart_		|| null 						; // 'f' 
 			 options.axisxyz_				=	options.axisxyz_			|| false						;
			 options.camera_				=	options.camera_				|| 'ortho'						;
			this._3js						=	new JSONCad._3js(this_, options);
			window.addEventListener( "keypress",  function(e){	  if (e.keyCode == 102)  this_._3js.toFrontView(e); },  false	);
	 		this._3js.setitems(this,target,options);
   			this.render();
}; 
JSONCad.Viewer.prototype = {
			initDom : function (this_){
					var  style				=	document.createElement('style') 
						,bigdiv				=	document.createElement('div'  )
						,imageid			=	document.createElement('div'  )  
 						bigdiv.id			=	'bigdiv'	;
						imageid.id			=	'imageid'	;
						style.id			=	'styleid'	;
						style.type			=	'text/css'	;
						style.innerHTML		=	'#imageid,#viewer, #biggerdiv { top: 0px; left: 0px; border: 0px; padding: 0;  width: 100%; height: 100% ;display: block; position: fixed;}';
						bigdiv.innerHTML	=	'<div id="viewer" class =  "viewer" ></div></div>'				;
 												document.getElementsByTagName('head')[0].appendChild(style)		;
 												document.getElementsByTagName('body')[0].appendChild(bigdiv)	;
												document.getElementsByTagName('body')[0].appendChild(imageid)	;
										return	document.getElementById('viewer')								;
			},
 			render: function() {			
						this.requestID_	 =	requestAnimationFrame(this.render.bind(this) );	 	
						if( !!	this._3js.pointcloud_ )		
								this._3js.pointcloud_.update(this._3js.camera_, this._3js.renderer_);	 
						this._3js.controls_.update();								 
						this._3js.camera_.updateProjectionMatrix();					 
						this._3js.renderer_.render(this._3js.scene_, this._3js.camera_);		 
			}
 };
JSONCad._3js =   function(this_, options){
								var camera_ 				=  (options.camera_ != 'ortho' ) 
																?	new THREE.PerspectiveCamera( options.perspective_, options.containerElm_.clientWidth/options.containerElm_.clientHeight , 0.01, 1000000)  
																:	new	THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -500, 1000 ) ;
 								 camera_.aspect			=	window.innerWidth	/	window.innerHeight  ;	  	
								 camera_.left			=	window.innerWidth   /-2		;
 								 camera_.right			=	window.innerWidth   / 2		; 
								 camera_.top			=	window.innerHeight  / 2		;
								 camera_.bottom			=	window.innerHeight  /-2		;
								 camera_.position.set( 100 ,50 ,100 );		//	this_.camera_.position.set(200,100,200 );//this_.camera_.up.set(0,0,1);	
								 camera_.lookAt(new THREE.Vector3(0,0,0)); 
								 camera_.updateProjectionMatrix();
								this.camera_ = camera_;

								this.controls_ 					=	new THREE.OrthographicTrackballControls(this.camera_ );
								this.renderer_					=	new THREE.WebGLRenderer({alpha: true} );	
								this.renderer_.setClearColor(			new THREE.Color(options.bgColor_	));
								this.renderer_.setPixelRatio(	1	);
								this.renderer_.setSize(			options.containerElm_.clientWidth, options.containerElm_.clientHeight);	
								this.renderer_.setFaceCulling(	THREE.CullFaceNone			);
								this.renderer_.autoClear		=	false;

								options.containerElm_.appendChild(	this.renderer_.domElement);
 								this.renderer_.domElement.addEventListener("webglcontextlost"		, function(e) {		e.preventDefault();  this.pauseRender_ = true;		cancelAnimationFrame(this__._3js.requestID_);	  }, false);
								this.renderer_.domElement.addEventListener("webglcontextrestored"	, function(e) {							  this.pauseRender_ = true;		cancelAnimationFrame(this_._3js.requestID_ );	  }, false);

								var	directionalLight2		=   new	THREE.DirectionalLight( 0xffffff, 2 );			directionalLight2.position.set(  2, 1.2,  10 ) ;	
								var	directionalLight1		=   new	THREE.DirectionalLight( 0xffffff, 1 );			directionalLight1.position.set( -2, 1.2, -10 ) ;
								var	pointLight				=   new	THREE.PointLight(		0xffaa00, 2 );			pointLight.position.set  ( 2000, 1200, 10000 );
 			
								this.scene_	 =	new THREE.Scene();		
								this.scene_	.add( new THREE.AmbientLight( 0x050505 ) );					
								this.scene_	.add( directionalLight2	);
								this.scene_	.add( directionalLight1	);
								this.scene_	.add( pointLight	    );
								if ( options.axisxyz_)  	this.scene_.add( new THREE.AxisHelper( 450 )  );	
								this.mlib =  {

 			 								"Blue"				: 	new THREE.MeshLambertMaterial(	{ color: 0x001133, combine: THREE.MixOperation, reflectivity: 0.3									} )
										,	"Red"				:	new THREE.MeshLambertMaterial(	{ color: 0x660000, combine: THREE.MixOperation, reflectivity: 0.25									} )
 										,	"White"				:	new THREE.MeshLambertMaterial(	{ color: 0xffffff, combine: THREE.MixOperation, reflectivity: 0.25									} )
										,	"Pure chrome"		: 	new THREE.MeshLambertMaterial(	{ color: 0xffffff, 																					} )
										,	"Dark chrome"		:	new THREE.MeshLambertMaterial(	{ color: 0x444444, 																					} )
  										,	"Red metal"			: 	new THREE.MeshLambertMaterial(	{ color: 0x770000, combine: THREE.MultiplyOperation													} )
										,	"Dark glass"		:	new THREE.MeshLambertMaterial(	{ color: 0x101046, opacity: 0.25, transparent: true													} )
										,	"Red glass 50"		: 	new THREE.MeshLambertMaterial(	{ color: 0xff0000, opacity: 0.5,  transparent: true													} )
 										,	"Orange glass 50"	:	new THREE.MeshLambertMaterial(	{ color: 0xffbb00, opacity: 0.5,  transparent: true													} )
										,	"Black rough"		:	new THREE.MeshLambertMaterial(	{ color: 0x050505																					} )
										,	"Light glass"		:	new THREE.MeshBasicMaterial(	{ color: 0x223344, combine: THREE.MixOperation, reflectivity: 0.25,		transparent: true			} )
 										,	"Gray shiny"		:	new THREE.MeshPhongMaterial(	{ color: 0x050505, shininess: 20																	} )
										,	"Fullblack rough"	:	new THREE.MeshLambertMaterial(	{ color: 0x000000																					} )
								};
								return this;
}  
JSONCad._3js.prototype ={
	setitems : function (this_, target, options){
					for (var each in target)  
 						for (var i = 0; i <  target[each][2].length; i++)
							  this_._3js[target[each][0]]({parms : target[each][1],  _3js :  this_._3js ,options : options ,instance : target[each][2][i]  })  ;

	},
toFrontView : function(e) {	if (!! e) {	e.preventDefault(); e.stopPropagation();}
									this.controls_.reset();
									this.camera_.up.set(0,1,0);
									this.camera_.position.set(0,0,800);
									this.camera_.rotation.order = "YXZ";					
									this.camera_.rotation.set(0,0,0);
									this.controls_.dispatchEvent( { type: 'change' } ); 
									this.controls_._changed = false;		
									this.controls_.update();	 	
},
rotate3TranslateScale :	function (ob, op ) {
				if (op.rotation) 	
								ob.object.rotation.set(op.rotation[0],op.rotation[1],op.rotation[2]);
				else if (op.r1) {
					var r1 = op.r1.axis
					  , r2 = op.r2.axis

					  // First Rotate r1 then r2
					ob	= (r1 == '1' || r1 == 'x' || r1 == 'X') ? ob.object.rotateX(op.r1.degrees) 
						: (r1 == '2' || r1 == 'y' || r1 == 'Y') ? ob.object.rotateY(op.r1.degrees) 
						: (r1 == '3' || r1 == 'z' || r1 == 'Z') ? ob.object.rotateZ(op.r1.degrees) 
						: ob;
					ob	= (r2 == '1' || r2 == 'x' || r2 == 'X') ? ob.object.rotateX(op.r2.degrees) 
						: (r2 == '2' || r2 == 'y' || r2 == 'Y') ? ob.object.rotateY(op.r2.degrees) 
						: (r2 == '3' || r2 == 'z' || r2 == 'Z') ? ob.object.rotateZ(op.r2.degrees) 
						: ob;
				}
				// After Rotate Resize
			if (op.size !== null && op.size !== undefined && op.size !== 1)
				ob = ob.scale(op.size);
				// After Resize setting a new color
			if (op.color !== null && op.color !== undefined)
				ob = ob.setColor(op.color);
				if (op.scale){		
									ob.object.scale.x	 =  op.scale[0] * 1;
									ob.object.scale.y	 =  op.scale[1] * 1;	
									ob.object.scale.z	 =  op.scale[2] * 1;
				}	
				ob.object.position.set(op.x ,op.y ,op.z)					
			},
	CSG3 : function( o  ) {
				try  {
				 var res =	THREE.CSG.fromCSG(	   makeVirtualObject(	 o.parms,null,nodes		)   ,o.options.defaultColor_) ; 
	 										o._3js.scene_.add(res.colorMesh);
											o._3js.scene_.add(res.wireframe);
						} catch(e) {		prompt(e.toString() +'\nStack trace:\n'+e.stack,e.toString() +'\nStack trace:\n'+e.stack); }
			return o;
		}
	,LOD3 : function(o   ){
					var		loader =		new	THREE.BinaryLoader( true );
							loader.load(o.parms.url,	function( geometry ) {  
										 	for (var i = 0; i < o.parms.parms.mats.length; i++)
										 		o.parms.parms.mmap[i]				=	o._3js.mlib[o.parms.parms.mats[i]]  ;
												o.parms.parms.face					=  	new THREE.MeshFaceMaterial()
												o.parms.parms.face.materials		=	o.parms.parms.mmap;  
												o.parms.parms.object				=	new THREE.Mesh( geometry,  o.parms.parms.face  );
												o._3js.rotate3TranslateScale(o.parms.parms, o.instance  );
												o._3js.scene_.add(o.parms.parms.object	);
		 					} ) 
	}
	,PCL3 : function( o ){	if (! o.parms ) return o;				
						POCLoader.load(o.parms, function(g){	
										o._3js.pointcloud_		=	new Potree.PointCloudOctree(g);
										var	reFrame				=	new THREE.Object3D(); 
										o._3js.scene_.add(	reFrame);
										reFrame.add(o._3js.pointcloud_);		
										reFrame.updateMatrixWorld(true);
										reFrame.position.copy(o._3js.pointcloud_.boundingSphere.clone().applyMatrix4(o._3js.pointcloud_.matrixWorld).center).multiplyScalar(-1);
										reFrame.updateMatrixWorld(true);
										reFrame.applyMatrix(new THREE.Matrix4().set(1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1	));
						}); 
		return o;
	}
	,HUD3 : function(o ){	 	o.svg =new  JSONCad.svg(o); 
									return o;
 	}
	,LLT3 :	function	  (o){	var ws= o.parms ,_3js= o._3js; o.instance= null;	

								function	lineTo    (x0,y0,z0 ,x1,y1,z1, clr ){  
											gm		=			new THREE.Geometry();	
											gm.vertices.push(	new THREE.Vector3(x0, y0,z0 ));		
											gm.vertices.push(	new THREE.Vector3(x1, y1,z1 ));		
													return		new THREE.Line( gm, new THREE.LineBasicMaterial( { color:  clr || 0  }  ), THREE.LinePieces ) ;
								} 
							// Leader Lines
							for (var j = 0; j < ws.length; j++) {
								 var  ob	=			ws[j]
									, base	=			0
									, top	=			ob.scale * 10 
									, bplus	=			Math.round(top *.2 )
									, mid	=			Math.round(top / 2 )
 									, lstrt =			Math.round(ob.scale * ob.line[0]  )
									, lend	=			Math.round(ob.scale * ob.line[ob.line.length-1]  ) ;

	 									if (ob.isx ) 	_3js.scene_.add(	 lineTo(  ob.x + lstrt , ob.y + mid		,0  , ob.x + lend,  ob.y + mid  ,0 ));
										else			_3js.scene_.add(	 lineTo(  ob.x + mid   , ob.y + lstrt	,0	, ob.x + mid ,  ob.y + lend ,0 ));
					
								for (var  i =0; i<  ob.line.length; i++){ 
										var lenxy	 =	Math.round(ob.scale * ob.line[i]  );
										if (ob.isx ) 	_3js.scene_.add(	 lineTo(  ob.x  + lenxy	, ob.y + base	,0 ,  ob.x + lenxy	  ,ob.y + top-base	,0 ));
										else			_3js.scene_.add(	 lineTo(  ob.x  + base	, ob.y + lenxy	,0 ,  ob.x + top-base ,ob.y + lenxy		,0 ));
										base		=   (i < (ob.line.length -2)	) ?   bplus : 0;
									}
								}	
								// leader text
								for (var j = 0; j < ws.length; j++) for (var ob =	ws[j], i =0; i<  ob.line.length; i++) 
						 			_3js.scene_.add( (ob.isx )	? 	 aLineOfText(ob.line[i],ob.txy[i].x +  ob.x  + Math.round(ob.scale * ob.line[i])		,ob.txy[i].y + ob.y + Math.round(ob.scale * 8   )			,0, ob.fontsz  , ob.color,ob.scale)	  
						 										:	 aLineOfText(ob.line[i],ob.txy[i].x +  ob.x  + Math.floor(ob.scale * 2  )				,ob.txy[i].y + ob.y + Math.round(ob.scale * ob.line[i]) 	,0, ob.fontsz  , ob.color,ob.scale));

										function aLineOfText     (theText,x,y,z, fontsize, fcolor,scale  ) {  
												 theText	=	theText	+ '';
												 x			=	x || 0; 
												 y			=	y || 0; 
												 z			=	z || 0; 
												 fontsize	=	fontsize	|| 7;
												 fontcolor	=	fcolor		|| 0;
												 scale		=	scale		|| 1;
												 fontsize	=	( scale < 1) ?	Math.round((fontsize * scale ) ) : Math.round( fontsize + scale  )
												 color		=	new THREE.Color(fontcolor)
												 ;
  												var convexhullShapeGroup	= []
												,		solidShapeGroup		= []
												,		beziers				= []
												,		invert				= []
												,		group				= new	THREE.Group()
												,		bezierGeometry		= new	THREE.Geometry() 
 												,		textMaterial		= new	THREE.MeshBasicMaterial( {	 color: new THREE.Color(0, 0, 1 ), overdraw: 0.5, wireframe: true, side: THREE.DoubleSide } ) 
 												,		textShapes			=		THREE.FontUtils.generateShapes( theText, {size: fontsize  ,height: 20,curveSegments: 2, font: "arial narrow", bevelEnabled: false} ) 
												,		text3d				= new	THREE.ShapeGeometry( textShapes );
 																					text3d.computeBoundingBox();

 													for (var s=0; s < textShapes.length;s++) {
 														var process		=		processShape(textShapes[s].curves);
 														beziers			=		beziers.concat(	process.beziers);
 														invert			=		invert.concat(	process.invert);
 														convexhullShape = new	THREE.Shape(	process.pts );
 														solidShape		= new	THREE.Shape(	process.pts2 );
 																				convexhullShapeGroup.push( convexhullShape );
 																				solidShapeGroup.push( solidShape );
 										
														for (var i=0; i< textShapes[s].holes.length;i++) {
 															process	=		processShape(	textShapes[s].holes[i].curves, true);
 															beziers	=		beziers.concat(	process.beziers);
 															invert	=		invert.concat(	process.invert);
 																			convexhullShape.holes.push(	new THREE.Shape(process.pts  ));
 																			solidShape.holes.push(		new THREE.Shape(process.pts2 ));
 															}
 													} 
 													for (var i=0;i<beziers.length;i++) 
 														bezierGeometry.vertices.push( new THREE.Vector3(beziers[i].x, beziers[i].y, 0) );			
 						 
 													for (i=0;i<beziers.length;i+=3) {
 														bezierGeometry.faces.push(    new THREE.Face3(i, i+1, i+2) );
 														bezierGeometry.faceVertexUvs[0].push( [new THREE.Vector2(0, 0),new THREE.Vector2(0.5, 0),new THREE.Vector2(1, 1)] );
 													}
 													bezierGeometry.computeBoundingBox();
 													bezierGeometry.computeFaceNormals();
 													bezierGeometry.computeVertexNormals();

													var text = new	THREE.Mesh( 
																	bezierGeometry
																,	new THREE.ShaderMaterial( {
																		attributes:		{ invert: { type: 'f', value: invert } }
																	,	uniforms:		{ color:  { type: 'c', value: color  } }
																	,	vertexShader:	getShader( 'vs' )
																	,	fragmentShader:	getShader( 'fs' )
																	,	side:			THREE.DoubleSide } )
																);
																text.position.set(x,y,z);
 																text.rotation.set(0,0,0);
 													group.add(  text );
 							
													text3d = new THREE.ShapeGeometry( solidShapeGroup );
 																text3d.computeBoundingBox();
 													text = new	THREE.Mesh( text3d, new THREE.MeshBasicMaterial( { color:  fontcolor, side: THREE.DoubleSide } ) );
 																text.position.set(x,y,z);
 																text.rotation.set(0,0,0);
													group.add(  text );
													return group;
 							
											function getShader(shadername){ 
														var sn={ fs : "varying vec2 vUv; varying float flip; uniform vec3 color; float inCurve(vec2 uv) {  return uv.x * uv.x - uv.y; } float delta = 0.1;	void main() { float x = inCurve(vUv); if (x * flip > 0.) discard; gl_FragColor = vec4(color, 1.);	}"
																,vs : "varying vec2 vUv; attribute float invert; varying float flip; void main() { vUv = uv; flip = invert;	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );	gl_Position = projectionMatrix * mvPosition;}"
															};
															return sn[shadername];	
											}
											function processShape(path ) {		
													var pts = [], pts2 = [],beziers = [],invert = [], z , vA = new	THREE.Vector2() ,vB	 = new	THREE.Vector2();
 													pts.push(  path[0].getPoint(0) );
 													pts2.push( path[0].getPoint(0) );
 													for (var i=0; i < path.length; i++) { var curve = path[i];
 														if (curve instanceof THREE.LineCurve) {	
															pts.push( curve.v2 );	
															pts2.push( curve.v2 );
															continue;
 														} 
														if (! curve instanceof THREE.QuadraticBezierCurve) continue;
 														vA	= vA.subVectors( curve.v1, curve.v0 );												 
 														vB	= vB.subVectors( curve.v2, curve.v1 );
 														z	=  vA.x * vB.y - vA.y * vB.x;															// z component of cross Production
 														if   (z < 0) {	pts.push( curve.v1 );	pts.push(  curve.v2 );	pts2.push( curve.v2 );	}	// clockwise/anticlock wind
														else {			pts.push( curve.v2 );	pts2.push( curve.v1 );	pts2.push( curve.v2 );	}
 										
														var flip = (z < 0) ? 1 : -1; 	 
 														invert.push(flip, flip, flip);
 														beziers.push( curve.v0, curve.v1, curve.v2);
 													}
 													return {pts: pts,pts2: pts2,beziers: beziers,invert: invert};
 											}
								}
				}
		, doImg : function (_3js,id,img,x,y,w,h,r1, r2){
											x= x || 0;
											y= y || 0;
											w= w || 1600;
											h= h || 900	;
										   var	img = new THREE.MeshBasicMaterial({    map: THREE.ImageUtils.loadTexture(img)  });
												img.map.needsUpdate = true; 
										var object = new THREE.Mesh(new THREE.PlaneGeometry(w, h),img);
										   object.rotation.x = -( Math.PI / 2) *.95   ; 
										  object.position.set(x,y,z);	//  object.position.set(250,-1, -30);
										  _3js.scene_.add( object );
 
				}  
}
JSONCad.svg = function (o){
						this.doSVGText(o.parms.etxt, o.parms.id); 
						if ( o.parms.frame)
 						this.doSVGImg( o.parms.frame, o.parms.id); 
}	
JSONCad.svg.prototype ={
	doSVGImg :	function   (img, id,x,y,w,h){
											x= x || 0;
											y= y || 0;
											w= w || 1600;
											h= h || 900	;
									if (!	document.getElementById('svg_' + id )) 
											document.getElementById( id	).appendChild(	svgobj ('svg_' + id ));
								var draw =	document.getElementById('svg_' + id );
											draw.appendChild(	svgimg (img,'img_'+id,x-40, y, w, h, img ));

						function svgobj(id,x,y,w,h){	var svg=document.createElementNS('http://www.w3.org/2000/svg',"svg");
											svg.setAttributeNS(null, 'id'			, id || 'svg'	);
											svg.setAttributeNS(null, 'x'			, x  || 0		);
											svg.setAttributeNS(null, 'y'			, y  || 0		);
											svg.setAttributeNS(null, 'width'		, w  || 1600	);
											svg.setAttributeNS(null, 'height'		, h  || 900		);
											return svg;
							}
						function svgimg(s,id,x,y,w,h){ if (! s) return null;
										var	img	= document.createElementNS('http://www.w3.org/2000/svg',"image"	);
											img.setAttributeNS(null, 'id'			, id || s + '_id'			);
											img.setAttributeNS(null, 'x'			, x  || 0					);
											img.setAttributeNS(null, 'y'			, y  || 0					);
											img.setAttributeNS(null, 'width'		, w  || 1600				);
											img.setAttributeNS(null, 'height'		, h  || 900					);
											img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', s	);
											return img;
							}
			},
doSVGText :	function 	  (ob,id ){
											if (!	document.getElementById('svg_' + id )) 
											document.getElementById( id	).appendChild(	svgobj ('svg_' + id ));
								var draw =	document.getElementById('svg_' + id );
											for (var i =0; i < ob.length; i++) 
												draw.appendChild(  svgtxt( ob[i].strng ,'text_'+ id+ '__' + i,  ob[i].x   ,ob[i].y  , ob[i].color,   ob[i].fontsz ,ob[i].rz ));

						function svgobj(id,x,y,w,h){	var svg=document.createElementNS('http://www.w3.org/2000/svg',"svg");
											svg.setAttributeNS(null, 'id'			, id || 'svg'	);
											svg.setAttributeNS(null, 'x'			, x  || 0		);
											svg.setAttributeNS(null, 'y'			, y  || 0		);
											svg.setAttributeNS(null, 'width'		, w  || 1600	);
											svg.setAttributeNS(null, 'height'		, h  || 900		);
											return svg;
							}
						 function svgimg(s,id,x,y,w,h){ if (! s) return null;
										var	img	= document.createElementNS('http://www.w3.org/2000/svg',"image"	);
											img.setAttributeNS(null, 'id'			, id || s + '_id'			);
											img.setAttributeNS(null, 'x'			, x  || 0					);
											img.setAttributeNS(null, 'y'			, y  || 0					);
											img.setAttributeNS(null, 'width'		, w  || 1600				);
											img.setAttributeNS(null, 'height'		, h  || 900					);
											img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', s	);
											return img;
							}
						 function svgtxt(s,id,x,y,clr,fsz,trz, ff,sty){ if (! s) return null;
										var	txt	= document.createElementNS('http://www.w3.org/2000/svg',"text" );
											txt.setAttributeNS(null, 'id'			, id  || s + '_txt'				);
											txt.setAttributeNS(null, 'x'			, x   || 0						);
											txt.setAttributeNS(null, 'y'			, y   || 0						);
											txt.setAttributeNS(null, 'fill'			, clr || 0						);
											txt.setAttributeNS(null, 'font-size'	, fsz || 8						);
											txt.setAttributeNS(null, 'font-family'	, ff  || 'Arial Narrow'			);
											txt.setAttributeNS(null, 'style'		, sty || 'text-anchor: left;'	);
											if (trz)
											txt.setAttributeNS(null, 'transform'	,  'rotate( ' + trz + ', ' + x  + ' , ' + y + ' ) ' );
											txt.appendChild(document.createTextNode(s))	;				
 											return txt;
							}
						 function svgline(id,x1,y1,x2,y2,clr,stw){ if (! s) return null;
										var	lin	= document.createElementNS('http://www.w3.org/2000/svg',"line"		);
											lin.setAttributeNS(null, 'id'			, id  ||   '_line'				);
											lin.setAttributeNS(null, 'x1'			, x1  || 0						);
											lin.setAttributeNS(null, 'y1'			, y1  || 0						);
											lin.setAttributeNS(null, 'x2'			, x2  || 0						);
											lin.setAttributeNS(null, 'y2'			, y2  || 0						);
											lin.setAttributeNS(null, 'stroke'		, clr || 0						);
											lin.setAttributeNS(null, 'stroke-width'	, stw || 1						);
  									return	lin;
							}	
						 function svgrect(id,x,y,w,h,rx,ry,stw,stc,fcl){ 
										var	rec	= document.createElementNS('http://www.w3.org/2000/svg',"rect"		);
											rec.setAttributeNS(null, 'id'			, id  ||   '_line'				);
											rec.setAttributeNS(null, 'x'			, x   || 0						);
											rec.setAttributeNS(null, 'y'			, y   || 0						);
											rec.setAttributeNS(null, 'width'		, w   || 0						);
											rec.setAttributeNS(null, 'height'		, h   || 0						);
											rec.setAttributeNS(null, 'rx'			, x   || 0						);
											rec.setAttributeNS(null, 'ry'			, y   || 0						);
											rec.setAttributeNS(null, 'fill'			, fcl || 0						);
											rec.setAttributeNS(null, 'stroke'		, stc || 0						);
											rec.setAttributeNS(null, 'stroke-width'	, stw || 1						);
  									return  rec;
							}	
						 function svgline(id,x1,y1,x2,y2,clr,stw){ 
										var	lin	= document.createElementNS('http://www.w3.org/2000/svg',"line"		);
											lin.setAttributeNS(null, 'id'			, id  ||   '_line'				);
											lin.setAttributeNS(null, 'x1'			, x1  || 0						);
											lin.setAttributeNS(null, 'y1'			, y1  || 0						);
											lin.setAttributeNS(null, 'x2'			, x2  || 0						);
											lin.setAttributeNS(null, 'y2'			, y2  || 0						);
											lin.setAttributeNS(null, 'stroke'		, clr || 0						);
											lin.setAttributeNS(null, 'stroke-width'	, stw || 1						);
  									return  lin;
							}	
						 function svgpath(id,d,clr,stw,fcl){ 
										var	pat	= document.createElementNS('http://www.w3.org/2000/svg',"path"		);
											pat.setAttributeNS(null, 'id'			, id  ||   '_path'				);
								if(!! d )	pat.setAttributeNS(null, 'd'			, d								);
								if(!!crl)	pat.setAttributeNS(null, 'stroke'		, clr  							);
								if(!!stw)	pat.setAttributeNS(null, 'stroke-width'	, stw  							);
								if(!!fcl)	pat.setAttributeNS(null, 'fill'			, fcl  							);
  											return	pat;
							}	
		 } 
}

 

 /////////////////////////////////////////////////////////////////////////////////
var gverbs = {
     "VOBJ"		: "VOBJ"			//	Virtual, created/creatable object
    ,"FUNC"		: "FUNC"			//	Function call to create virtual object
    ,"GETF"		: "GETF"			//	Get File... not yet implimented
    ,"GOBJ"		: "GOBJ"			//	Get File... not yet implimented
    ,"SCRP"		: "SCRP"			//	Process Script 
    ,"PIPE"		: "PIPE"			//	Cylinder   always centered at 0,0,0 lower
    ,"CONE"		: "CONE"			//	Cylinder with two radii
    ,"RIPE"		: "RIPE"			//	Rounded Cylinder
    ,"SPHR"		: "SPHR"			//	Sphere
    ,"DNUT"		: "DNUT"			//	Torus
    ,"CUBE"		: "CUBE"			//	Centered Cube
    ,"BOXZ"		: "BOXZ"			//	Cube lower left = 0,0,0
    ,"WOXZ"		: "WOXZ"			//	Wire Cube lower left = 0,0,0
    ,"WEDG"		: "WEDG"			//	3d Right Triangle at 0,0,0 = all right angles, 0,0
    ,"PYRM"		: "PYRM"			//	Pyramid from zeroed vecotrs
    ,"RUBE"		: "RUBE"			//	Rounded Cube
    ,"ROXZ"		: "ROXZ"			//	Rounded Cube lower left ~= 0,0,0
    ,"PHDR"		: "PHDR"			//	Polyhedron 
    ,"REDG"		: "REDG"			//	Rounded Wedge
    ,"RYRM"		: "RYRM"			//	Rounded Pyramid
    ,"TEXT"		: "TEXT"			//  Two Dimensional Text Rendered InSitu
    ,"LINE"		: "LINE"			//  Two Dimensional Line Rendered InSitu
    ,"LIN3"		: "LIN3"			//  Three Dimensional Line
    ,"PIN3"		: "PIN3"			//  Three Dimensional Line
    ,"PSG3"		: "PSG3"			//  Three Dimensional Connected Line Segments
    ,"LSG3"		: "LSG3"			//  Three Dimensional Connected Line Segments
    ,"INTE"		: "intersect"		//  CSG Inetersect function
    ,"UNIO"		: "union"			//  CSG union function
    ,"SUBT"		: "subtract"		//  CSG subtract function
    ,"INVE"		: "invert"			//  Not sure what this does but I can call it :)
    ,"INTERSECT": "intersect"		//  CSG Inetersect function
    ,"UNION"	: "union"			//  CSG union function
    ,"SUBTRACT"	: "subtract"		//  CSG subtract function
    ,"INVERT"	: "invert"			//  Not sure what this does but I can call it :)
    ,"intersect": "intersect"		//  CSG Inetersect function
    ,"union"	: "union"			//  CSG union function
    ,"subtract"	: "subtract"		//  CSG subtract function
    ,"invert"	: "invert"			//  Not sure what this does but I can call it :)
};
 
function wireCube(o) {		// creates a wireframe cube 
    var 
	  x2 =(o) ? (o.start)  ? o.start[0]	: 1 : 1
    , y2 =(o) ? (o.start)  ? o.start[1]	: 1 : 1
    , z2 =(o) ? (o.start)  ? o.start[2]	: 1 : 1
    ,  x =(o) ? (o.end	)  ? o.end[0]	: 2 : 2
    ,  y =(o) ? (o.end	)  ? o.end[1]	: 2 : 2
    ,  z =(o) ? (o.end	)  ? o.end[2]	: 2 : 2
    , sz =(o) ? (o.start)  ? 0.025		: 0.0125 : 0.0125					 
    , xs = x - 2 * sz
    , ys = y - 2 * sz
    , zs = z - 2 * sz;
    return (new CSG()).union([
        CSG.cube({size: 1}).scale([sz, sz, z2]).translate([ sz      , sz      , z2      ])
      , CSG.cube({size: 1}).scale([sz, sz, z2]).translate([ sz + xs , sz      , z2      ])
      , CSG.cube({size: 1}).scale([sz, sz, z2]).translate([ sz      , sz + ys , z2      ])
      , CSG.cube({size: 1}).scale([sz, sz, z2]).translate([ sz + xs , sz + ys , z2      ])
      , CSG.cube({size: 1}).scale([x2, sz, sz]).translate([ x2      , sz      , sz      ])
      , CSG.cube({size: 1}).scale([x2, sz, sz]).translate([ x2      , sz + ys , sz      ])
      , CSG.cube({size: 1}).scale([x2, sz, sz]).translate([ x2      , sz      , sz + zs ])
      , CSG.cube({size: 1}).scale([x2, sz, sz]).translate([ x2      , sz + ys , sz + zs ])
      , CSG.cube({size: 1}).scale([sz, y2, sz]).translate([ sz      , y2      , sz      ])
      , CSG.cube({size: 1}).scale([sz, y2, sz]).translate([ sz + xs , y2      , sz      ])
      , CSG.cube({size: 1}).scale([sz, y2, sz]).translate([ sz      , y2      , sz + zs ])
      , CSG.cube({size: 1}).scale([sz, y2, sz]).translate([ sz + xs , y2      , sz + zs ])
    ]);
}
function wireLine(o ) {			 
	var	   ax	 =  o.x1-o.x0	 
		, by	 =  o.y1-o.y0	 
		, cz	 =  o.z1-o.z0	 
		, ax2	 =  ax  * ax	 
		, by2	 =  by  * by	 
		, cz2	 =  cz  * cz	 
		, ax2by2 =  ax2 + by2	 
		, ax2cz2 =  ax2 + cz2	 
		, by2cz2 =  by2 + cz2    
		, sz	 =  o.lwidth ||  0.125 ;  
	if ( !ax2by2 || ! by2cz2 || ! ax2cz2)  {
		var  a =   (!! ax2by2 && !! ax2cz2 )  ? ax / 2   : sz   
			,b =   (!! ax2by2 && !! by2cz2 )  ? by / 2   : sz   
			,c =   (!! by2cz2 &&  !!ax2cz2 )  ? cz / 2   : sz   
			,d =	(a == sz) ? 0 : a	 
			,e =	(b == sz) ? 0 : b	 
			,f =	(c == sz) ? 0 : c	 
			return (!  o.type) ?	new CSG.cube({size: 1}).scale([ a  , b, c]).translate([o.x0 + a, o.y0 + b, o.z0 + c])
								:	new CSG.cylinder({start: [0, 0, 0],end: [d, e, f],radius: sz }).translate([o.x0  , o.y0  , o.z0 ])
	}
	var   s		=  Math.sqrt(ax2 + by2 + cz2)						 
		, ss	=  Math.sqrt(ax2 + cz2  )							 
		, s2	=  s/2												 
		, zdeg	=  Math.asin( by/s)				* 180/ Math.PI		 
		, ydeg	=  Math.acos(Math.abs( ax) /ss)	* 180/ Math.PI  ;	 
		  ydeg =   (ax <= 0 && cz > 0)	? 180  + ydeg				 
				:  (ax <= 0 && cz < 0)	? 180  - ydeg 				  
				:  (ax >= 0 && cz > 0)	? 	   - ydeg  				 
				:								 ydeg;
 		return (!  o.type) ?	new CSG.cube({size: 1}).scale([ s2,sz,sz]).translate([s2,sz,sz]).rotateZ(zdeg).rotateY(ydeg).translate([o.x0, o.y0, o.z0])   
						   : 	new CSG.cylinder({start: [0, 0, 0],end: [s, 0, 0],radius: sz } ).rotateZ(zdeg).rotateY(ydeg).translate([o.x0, o.y0, o.z0]); 
 }
function segsLine(o){  
	 o.x0 =	 o.x1
	 o.y0 =	 o.y1
	 o.z0 =	 o.z1
	 o.x1 =  o.instances[o.i].x
	 o.y1 =  o.instances[o.i].y
	 o.z1 =  o.instances[o.i].z
	 return  wireLine(o ).translate([-o.x1,-o.y1,-o.z1]);  
}
function doSizeColor(op, ob) { 
       ob = (op.size  !== null && op.size  !== undefined &&  op.size !== 1) ? ob.scale(op.size)		: ob;
    return (op.color !== null && op.color !== undefined )				   ? ob.setColor(op.color)	: ob;
}
 
function includeJS(url){
	if(url.split(".").pop() != 'js' && url.split(".").pop() != 'jscad') return;
    var req = new XMLHttpRequest();
    req.open("GET", url, false);  
    req.send(null);
    var head		=	document.getElementsByTagName('head')[0] 
	,	 el			=	document.createElement('script');
		 el.type	=	'text/javascript';
		 el.text	=	req.responseText;
		if(!! head && head.innerHTML.indexOf(el.outerHTML) ==-1)  
		head.appendChild(el);
}
function GETF(o) {
			includeJS(o.uri);
    return doSizeColor(o,  this[o.call](o.prms));
}
function GOBJ(o) {
			includeJS(o.uri);
	var newobj = window[o.nodeSet];
	return doSizeColor(o, makeVirtualObject(	newobj[o.each],null, newobj		));
}
function FUNC(o) {
    return doSizeColor(o,  this[o.call](o.prms));
}
function SCRP(o) {
    return doSizeColor(o, OpenJSONCad.parseJsCadScriptSync(new Function(document.getElementById(o.scp).textContent + "\ndebugger;\n return (new CSG()).union(" + o.call + "(" + o.prms + "));")));
}
function VOBJ(o) {
	var newobj ={};
	if (o.nodeSet[o.each]  instanceof Array  )  newobj[o.each]	=  o.nodeSet[o.each];
	else										newobj			=  o.nodeSet[o.each];
	return doSizeColor(o, makeVirtualObject(	newobj	, null,    o.nodeSet	));
}
function CUBE(o) {
    return doSizeColor(o, CSG.cube({size: 1}).scale([o.dimx, o.dimy, o.dimz]));
}
function IMG3(o) {
    return doSizeColor(o, CSG.cube({size: 1}).scale([o.dimx, o.dimy, o.dimz]).translate([o.dimx, o.dimy, o.dimz]));
}
function BOXZ(o) {
    return doSizeColor(o, CSG.cube({size: 1}).scale([o.dimx, o.dimy, o.dimz]).translate([o.dimx, o.dimy, o.dimz]));
}
function RUBE(o) {
    return doSizeColor(o, CSG.roundedCube({size: 1,resolution: o.r,roundradius: o.r}).scale([o.dimx, o.dimy, o.dimz]));
}
function ROXZ(o) {
    return doSizeColor(o, CSG.roundedCube({size: 1,resolution: o.r,roundradius: o.r}).scale([o.dimx, o.dimy, o.dimz]).translate([o.dimx, o.dimy, o.dimz]));
}
function WOXZ(o) {
    return doSizeColor(o, wireCube({start: [o.dimx, o.dimy, o.dimz],end: [o.x, o.y, o.z]}));
}
function LIN3(o) {
    return doSizeColor(o, wireLine(o));
}
function LSG3(o) {
    return doSizeColor(o, segsLine(o));
}
function PIN3(o) {
    return doSizeColor(o, wireLine(o));
}
function PSG3(o) {
    return doSizeColor(o, segsLine(o));
}
function PIPE(o) {
    return doSizeColor(o, CSG.cylinder({start: [0, 0, 0],end: [0, 0, o.len],radius: o.r }));
}
function CONE(o) {
    return doSizeColor(o, CSG.cylinder({start: [0, 0, 0],end: [0, 0, o.len],radius: o.r,radiusStart: o.rs,radiusEnd: o.re}));
}
function RIPE(o) {
    return doSizeColor(o, CSG.roundedCylinder({start: [0, 0, 0],end: [0, 0, o.len],radius: o.r,normal: o.rad,resolution: o.res}));
}
function RONE(o) {
    return doSizeColor(o, CSG.roundedCylinder({start: [0, 0, 0],end: [0, 0, o.len],radius: o.r,normal: o.rad,resolution: o.res}));
}
function WEDG(o) {
    return doSizeColor(o, (new CSG()).intersect([CSG.cube({size: 1}).translate([1, 1, 1-.414213562373]), CSG.cube({size: 1.414213562373}).rotateZ(45)]).translate([0,0,  0.414213562373]).scale([o.x, o.y, o.z]));
}
function REDG(o) {
    return doSizeColor(o, (new CSG()).intersect([CSG.roundedCube({size: 1,resolution: o.r,roundradius: o.r}).translate([1, 1, 1]), CSG.roundedCube({size: 1,resolution: o.r,roundradius: o.r}).rotateZ(45)]));
}
function PYRM(o) {
    return doSizeColor(o, (new CSG()).intersect([CSG.cube({size: 1 } ).translate(1,1,1) , CSG.cube({size: 1 }).rotateX(-36.5).rotateY( 45).scale(1.41 ).translate(-.2,-.2,-.2) ]).scale([o.x, o.y , o.z ])) ;
}
function TEXT(o){
	return doSizeColor(o,textLine(o) );
}
function LINE(o){
	return doSizeColor(o,lineLine(o) );
}
function SPHR(o) {
    return doSizeColor(o, CSG.sphere(o)) ;
}
function SPHG(o) {    return;
}
function DNUT(o) {
    return  doSizeColor(o,  torus(o));
}
function makeParms(vb, o, nodeSet ,  each ) {
    if (typeof (o) == "object" && ! o instanceof Array){ o.nodeSet = nodeSet; o.each =  each;
        return sizeColor(  o.size, o.color,o);
    }
    function sizeColor(size, color, o) {  o.color = color || null;   o.size = size || 1;   return o;    }
    switch ( vb ) { //size   color			o
        case 'VOBJ':
            return sizeColor(o[0], o[1], {nodeSet : nodeSet,each : each });
        case 'FUNC':
            return sizeColor(o[2], o[3], {call: o[0],prms: o[1]});
        case 'GETF':
            return sizeColor(o[3], o[4], {call: o[0], uri: o[1],prms: o[2]});
        case 'GOBJ':
            return sizeColor(o[3], o[4], { uri: o[1], nodeSet: o[2], each : o[0]});
        case 'SCRP':
            return sizeColor(o[3], o[4], {call: o[1],prms: o[2],scp: o[0]});
        case 'PIPE':
            return sizeColor(o[2], o[3], {r: o[0],len: o[1]});
        case 'CONE':
            return sizeColor(o[4], o[5], {r: o[0],len: o[1],rs: o[2],re: o[3]});
        case 'RONE':
            return sizeColor(o[5], o[6], {r: o[0],len: o[1],r1: o[2],rad: o[3],res: o[4]});
        case 'RIPE':
            return sizeColor(o[5], o[6], {r: o[0],len: o[1],rad: o[3],res: o[4]});
        case 'SPHR':
            return sizeColor(o[2], o[3], {r0: o[0],res: o[1]});
        case 'DNUT':
            return sizeColor(o[5], o[6], {ri: o[0],fni: o[1],roti: o[2],ro: o[3],fno: o[4]});
        case 'LIN3':	
            return  ( o.length < 6) ?	sizeColor(o[1], o[2], { x0 : 0    ,y0 : 0    ,z0:  0   ,x1: o[0] ,y1: 0    ,z1:  0   ,lwidth : o[3] } ) 
									:	sizeColor(o[6], o[7], { x0 : o[0] ,y0 : o[1] ,z0: o[2] ,x1: o[3] ,y1: o[4] ,z1: o[5] ,lwidth : o[8] } );
        case 'IMG3':	
            return   	sizeColor(0, 0, { x0 : o[1] ,y0 : o[2] ,z0: o[3] ,x1: o[4] ,y1: o[5] ,z1: o[6] ,url : o[0]  } );
        case 'LSG3':	
            return  sizeColor(o[3], o[4], { x0: o[0] ,y0 : o[1] ,z0: o[2],x1: o[0] ,y1: o[1] ,z1: o[2] ,lwidth : o[5] } );
        case 'PIN3':	
            return  ( o.length < 6) ?	sizeColor(o[1], o[2], { x0 : 0    ,y0 : 0    ,z0:  0   ,x1: o[0] ,y1: 0    ,z1:  0   , type : 'pipe' ,lwidth : o[3]}  ) 
									:	sizeColor(o[6], o[7], { x0 : o[0] ,y0 : o[1] ,z0: o[2] ,x1: o[3] ,y1: o[4] ,z1: o[5] , type : 'pipe' ,lwidth : o[8]} );
        case 'PSG3':	
            return  sizeColor(o[3], o[4], { x0: o[0] ,y0 : o[1] ,z0: o[2],x1: o[0] ,y1: o[1] ,z1: o[2]  , type : 'pipe' ,lwidth : o[5] } );
        case 'CUBE':
            return sizeColor(o[3], o[4], {x: o[0],y: o[1],z: o[2],dimx: o[0] / 2,dimy: o[1] / 2,dimz: o[2] / 2});
        case 'BOXZ':
            return sizeColor(o[3], o[4], {x: o[0],y: o[1],z: o[2],dimx: o[0] / 2,dimy: o[1] / 2,dimz: o[2] / 2});
        case 'WOXZ':
            return sizeColor(o[3], o[4], {x: o[0],y: o[1],z: o[2],dimx: o[0] / 2,dimy: o[1] / 2,dimz: o[2] / 2});
        case 'WEDG':
            return sizeColor(o[3], o[4], {x: o[0],y: o[1],z: o[2]});
        case 'PYRM':
            return sizeColor(o[3], o[4], {x: o[0],y: o[1],z: o[2],dimx: o[0] / 2,dimy: o[1] / 2,dimz: o[2] / 2});
        case 'RYRM':
            return sizeColor(o[3], o[4], {x: o[0],y: o[1],z: o[2],dimx: o[0] / 2,dimy: o[1] / 2,dimz: o[2] / 2});
        case 'RUBE':
            return sizeColor(o[5], o[6], {x: o[0],y: o[1],z: o[2],dimx: o[0] / 2,dimy: o[1] / 2,dimz: o[2] / 2,rad: o[3],res: o[4]});
        case 'ROXZ':
            return sizeColor(o[5], o[6], {x: o[0],y: o[1],z: o[2],dimx: o[0] / 2,dimy: o[1] / 2,dimz: o[2] / 2,rad: o[3],res: o[4]});
        case 'REDG':
            return sizeColor(o[5], o[6], {x: o[0],y: o[1],z: o[2],dimx: o[0] / 2,dimy: o[1] / 2,dimz: o[2] / 2,rad: o[3],res: o[4]});
        case 'RYRM':
            return sizeColor(o[5], o[6], {x: o[0],y: o[1],z: o[2],dimx: o[0] / 2,dimy: o[1] / 2,dimz: o[2] / 2,rad: o[3],res: o[4]});
    }
}
function rotateTranslate(ob, op) {
    var r1 = op.r1.axis
      , r2 = op.r2.axis
    ob	= (r1 == '1' || r1 == 'x' || r1 == 'X') ? ob.rotateX(op.r1.degrees) 
		: (r1 == '2' || r1 == 'y' || r1 == 'Y') ? ob.rotateY(op.r1.degrees) 
		: (r1 == '3' || r1 == 'z' || r1 == 'Z') ? ob.rotateZ(op.r1.degrees) 
		: ob;
    ob	= (r2 == '1' || r2 == 'x' || r2 == 'X') ? ob.rotateX(op.r2.degrees) 
		: (r2 == '2' || r2 == 'y' || r2 == 'Y') ? ob.rotateY(op.r2.degrees) 
		: (r2 == '3' || r2 == 'z' || r2 == 'Z') ? ob.rotateZ(op.r2.degrees) 
		: ob;
    if (op.size !== null && op.size !== undefined && op.size !== 1)
        ob = ob.scale(op.size);
    if (op.color !== null && op.color !== undefined)
        ob = ob.setColor(op.color);
    return ob.translate([op.x, op.y, op.z]);
}
function makeVirtualObject(nodeSet,  setOperator,basenode) {
    var gObjSet = [];
	basenode = basenode || nodes;

			function makeInstances(instanceArray) {
				for (var i = 0; i < instanceArray.length; i++) {
					var a = instanceArray[i]
					 if (a instanceof Array)
						instanceArray[i] = {x: a[0],y: a[1],z: a[2],r1: {axis: a[3],degrees: a[4]},r2: { axis: a[5],degrees: a[6] } ,size: (a[7]) ? a[7] : 1, color: (a[8]) ? a[8] : null }
				}
				return instanceArray;
			}

    for (var each in nodeSet) {
        if (each == 'intersect' || each == 'subtract' || each == 'invert' || each == 'union') {
            gObjSet.push(makeVirtualObject(nodeSet[each],  each, basenode));
            continue;
        }
        var gType	= gverbs[ (nodeSet[each][0]).toUpperCase()]							 
        , params	= makeParms( gType, nodeSet[each][1], basenode ,  each );		 
			params.instances = makeInstances(    nodeSet[each][2]);				 
        for ( params.i = 0;  params.i < params.instances.length;  params.i++)
            gObjSet.push(rotateTranslate(this[ gType ](params), params.instances[ params.i]));  
      }
    return (setOperator == 'intersect') ?	(new CSG()).intersect(gObjSet) 
		:  (setOperator == 'subtract' ) ?	 difference (gObjSet)	 
		:  (setOperator == 'invert'   ) ?	(new CSG()).invert(gObjSet) 
		:  (setOperator == 'union'    ) ?	(new CSG()).union(gObjSet) 
    	:									(new CSG()).union(gObjSet);

}