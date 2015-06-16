// openJSONCad.js, a Parser function to handle JSONCAD JSON graphics specification
//
// Copyright (c) 2015 by James Reilly <jimreillyemail@gmail.com>
//
// Version: 0.001
// License: MIT License
//
// OpenJSONCad is an offshoot and extension of the OpenJSCad concept whose goal
// is to provide a JSON specification and processing capablity to emulate, and
// extend the OpenJSCad concept.   
// 
// The JSON specification that is presently utilized as input to this function
// can be found in the OpenJSONCad_parser.js module. In it you will find both
// JSCad compatible JSON as well as JSON specification for a very small subset
// of Three.js. 

// Hopefully the JSON needed to utilize this code will be found to be both
// relatively complete and straightforward, or at least complete enough
// and simple enough to be able to create object by using JSON alone.
// 
// There are several examples also included in this package that show how to 
// use the JSON specification to create complete compositions that include
// JSCad, Three.js, annotations using lines and leaders as well as front end
// SVG based graphics and text.
//
// Example 1 shows the use of JSCad called by a JSON specfied function name 
// that then calls the external JSCad example5 example to create a gazebo to be
// rendered inside a scene that also includes a composition of three.js cars, 
// line leaders, pointcloud and a front end of SVG text and image (engineering
// drawing frame)
//
// Example 2 is the exact same drawing rendered without calling jscad functions.
// instead the items are specficed in JSONCad.
//
//  Example3: Is a stand alone engineering drawing that is written in JSONCad
//	it is the same drawing that was posted before on the OpenJSCad website.
// 
//	Example4: Takes a few of the other JSCad examples and impliments them in 
//	JSONCad.
//
// 
//
//  Areas of suggested improvement:
//  
// The following is a laundry list of items that would be useful to impliment
//
//	1 - Replace openjsoncad_annotate.js SVG code with a robust but usable set of SVG modules
//		and extend the json to support them. This SVG component was born out of
//		the requirement for text and graphics to front end the Three.js DOM element
//		for purposes of engineering drawing documentation and is only the subset 
//		that I needed.
//
//	2 - The same is true for text and line graphics also in openjsoncad_annotate.js. 
//		The leader line and line text functions work well but there is always room for 
//		other leader lines, better text processing, arrows, automatic sizing capablities
//		as well as other Fonts, and font attributes. Note that the text generator is
//		taken from a Three.js example that utilized two pass bezier graphics to  
//		generate high quality text.  This two pass system really makes a difference when
//		viewing 2d text in a 3d rendered scene.  Nonetheless it is only text generation
//		using whatever  
//  
//	3-	The Viewer function creates the entire three.js environment for rendering and
//		viewing the results of the JSONCad document. This module should provide a 
//		usable User Interface to review the results of the generation of JSONCad. 
//		At some point it would make logical sense to separate out the options processing
//		from the Three.js implementation but for ease of understanding and modification sake
//		all of the Three.js specfic components are included in this module.  
//
// 4 -  Rene suggested that we approach Three.js to solicit their participation in a Three.js
//		JSON specification to replace or augment (hopefully replace) the Three.js mini parser
//		provided.  Three.js presently has many JSON specified components but they are at the 
//		vertex/shader/geometry level and are inscrutible as an end user tool.  Providing a	
//		higher level specification that includes animatnion,cubemaps, etc that is at the user
//		object level as opposed to the webgl rendering level would make three.js and webgl 
//		a lot more accessible. Right now to create and render objects one needs to use 
//		Blender, Maya or other tools. (Which are in an of themselves another cost and steep
//		learning curve.
// 


//  Finally I realize that my code and text formatting is non standard and for that I used to  
//  apologize until I realized that the rules  of formatting of software were defined  
//  in the 1960's when one needed to print out code in order to debug it and when debuggers
//  could only stop on individual lines of code. I don't know  about anyone else
//  but the last time I printed out any software was in the 1990's.  Every coder by now 
//  works on a minimum 1600 x 900 pixel screen so why not use all of it? 
//  
//  I try to format my code so that one can get a feel for the processing by simply looking at the 
//  blocks of code and the repeatedly similar lines that are always present in software.
//  Also where possible I try to be minimalist in my use of the language and rarely invoke the else 
//  component of if then statements.  IMHO code is easier to understand as a sequence of steps that
//	once finished return to caller.  The else clause and lots of extra parenthesis make the code look
//  like an MC Escher painting. 
//
//  Consolas  monspace font and 4 spaces per tab. (It was written using 
//  MS Visual Studio 10.  (If anyone has a better editing tool with better vertical 
//  text selection capabilities please let me know.)
//  
//  == openjscad.js  which was the genesis of this software but no longer uses any of its code
//    was  originally written by Joost Nieuwenhuijse (MIT License)
//   few adjustments by Rene K. Mueller <spiritdude@gmail.com> for OpenJSCAD.org
//
// History:
// 2015/06/05:   First release of .01 of OpenJSONCad.js, OpenJSONCad_parser.js, OpenJSONCa
  

OpenJSONCad			= function() {};
OpenJSONCad.Viewer	= function( options) {
												// Setting up basic options and defaults
  			var this_						=	this;
			this.options					=	options							|| null;		
	 		this.options.containerElm_		=	this.options.containerElm_		|| this.initDom()				;
			this.options.widthDefault_		=	this.options.widthDefault_		|| '1600px'						;
			this.options.heightDefault_		=	this.options.heightDefault_		|| '900px'						;
			this.options.width_				=	this.options.width_				|| '1600px'						;
			this.options.height_			=	this.options.height_			|| '900px'						;
			this.options.heightRatio_		=	this.options.heightRatio_		|| 16/9 						;
			this.options.perspective_		=	this.options.perspective_		|| 45							;
			this.options.drawOptions_		=	this.options.drawOptions_		|| {lines : false, faces : true};
			this.options.defaultColor_		=	this.options.defaultColor_		|| [ 0, 0, 1   ,1]				;
			this.options.bgColor_			=	this.options.bgColor_			|| [.93,.93,.93,1]				;
			this.options.drawFaces_			=	this.options.drawFaces_			|| true							;
			this.options.background_		=	this.options.background_		|| true							;
			this.options.drawLines_			=	this.options.drawLines_			|| false 						;
			this.options.cameraStart_		=	this.options.cameraStart_		|| null 						;
			this.options.csgScript_			=	this.options.csgScript_			|| null							;
			this.options.headsUpDisplay_	=	this.options.headsUpDisplay_	|| null							;
			this.options.pointcloudName_	=	this.options.pointcloudName_	|| null							;
			this.options.threeJSEnvObjs_	=	this.options.threeJSEnvObjs_	|| null							;
 			this.options.threeJSAnnotate_	=	this.options.threeJSAnnotate_	|| null							;
			this.options.axisxyz_			=	this.options.axisxyz_			|| false						;
			this.options.camera_			=	this.options.camera_			|| 'ortho'						;
			this.options.renderer_			=	this.options.renderer_			|| 'webgl'						;
			this.options.controls_			=	this.options.controls_			|| 'ortho'						;
							 
			this.containerElm_				=	this.options.containerElm_ ;	
			this.camera_					=  (this.options.camera_ != 'ortho' ) 
											?	new THREE.PerspectiveCamera(this.options.perspective, this.containerElm_.clientWidth/this.containerElm_.clientHeight , 0.01, 1000000)  
											:	new	THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -500, 1000 )
 	
			this.scene_						=	new THREE.Scene();			 					
	
			this.renderer_					=	new THREE.WebGLRenderer({alpha: true} );	
 	
			this.controls_ 					=	new THREE.OrthographicTrackballControls(this.camera_ );
 			this.pauseRender_				=	false						;
 			this.camera_.aspect				=	this.options.heightRatio_	;		  	
			this.camera_.left				=	window.innerWidth   /-2		;
 			this.camera_.right				=	window.innerWidth   / 2		; 
			this.camera_.top				=	window.innerHeight  / 2		;
			this.camera_.bottom				=	window.innerHeight  /-2		;
			
			this.camera_.position.set( 100 ,50 ,100 );		//	this.camera_.position.set(200,100,200 );//this.camera_.up.set(0,0,1);	
			this.camera_.lookAt(new THREE.Vector3(0,0,0)); 
			this.camera_.updateProjectionMatrix();


			var	directionalLight2		=   new	THREE.DirectionalLight( 0xffffff, 2 );
			var	directionalLight1		=   new	THREE.DirectionalLight( 0xffffff, 1 );
			var	pointLight				=   new	THREE.PointLight(		0xffaa00, 2 );
			this.bgColor_				=	new THREE.Color();   

			this.bgColor_.setRGB.apply(		this.options.bgColor_		);  
			this.renderer_.setClearColor(	this.bgColor_				);
			this.renderer_.setPixelRatio(	window.devicePixelRatio		);
			this.renderer_.setSize(			this.containerElm_.clientWidth, this.containerElm_.clientHeight);	
			this.renderer_.setFaceCulling(	THREE.CullFaceNone			);
			this.renderer_.autoClear		=	false;

			this.containerElm_.appendChild(	this.renderer_.domElement);

			directionalLight2.position.set(  2, 1.2,  10 ) ;		
			directionalLight1.position.set( -2, 1.2, -10 ) ;		
			pointLight.position.set  ( 2000, 1200, 10000 );

			this.scene_	.add( new THREE.AmbientLight( 0x050505 ) );					
			this.scene_	.add( directionalLight2	);
			this.scene_	.add( directionalLight1	);
			this.scene_	.add( pointLight	    );

			if ( this.options.axisxyz_) {
 	 			var axisxyz	 = 	new THREE.AxisHelper( 450 )  ;		
				axisxyz.position.set(0, 0, 0);	
				this.scene_.add( axisxyz );	
			}
 			this.renderer_.domElement.addEventListener("webglcontextlost"		, function(e) {		e.preventDefault();  this_.pauseRender_ = true;		cancelAnimationFrame(this_.requestID_);	  }, false);
			this.renderer_.domElement.addEventListener("webglcontextrestored"	, function(e) {							  this.pauseRender_ = true;		cancelAnimationFrame(this.requestID_ );	  }, false);
 
 			window.addEventListener( "keypress",  function(e){	  if (e.keyCode == 102)  this_.toFrontView(e); },  false	); // press f key for front
  		//	window.addEventListener( "keypress",  function(e){	  if (e.keyCode == xxx)  this_.toPlanView(e);	  },  false	); // 
  		//	window.addEventListener( "keypress",  function(e){	  if (e.keyCode == xxx)  this_.toSectionAView(e); },  false	); // not yet implimented but could be useful
  		//	window.addEventListener( "keypress",  function(e){	  if (e.keyCode == xxx)  this_.toSectionBView(e); },  false	); // 
 
			make3VirtualObject(this.options.threeJSEnvObjs_,  this.scene_);			
			this.setPointCoud( );
			this.setHeadUpDisplay( );
			this.doLeaderLinesAndText( );
			this.setJSONCad();
			this.render();
}; 
OpenJSONCad.Viewer.prototype = {
			initDom : function (){
					var  style				=	document.createElement('style') 
						,bigdiv				=	document.createElement('div'  )
						,imageid			=	document.createElement('div'  ) ;
						
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
						if( !!	this.pointcloud_ )		
								this.pointcloud_.update(this.camera_, this.renderer_);	 
						this.controls_.update();								 
						this.camera_.updateProjectionMatrix();					 
						this.renderer_.render(this.scene_, this.camera_);		 
			},
 			setPointCoud : function ( ){	if (! this.options.pointcloudName_) return;				
						var this_		= this;
					
						POCLoader.load(this_.options.pointcloudName_, function(g){	
										this_.pointcloud_		=	new Potree.PointCloudOctree(g);
										var	reFrame				=	new THREE.Object3D(); 
										this_.scene_.add(	reFrame);
										reFrame.add(this_.pointcloud_);		
										reFrame.updateMatrixWorld(true);
										reFrame.position.copy(this_.pointcloud_.boundingSphere.clone().applyMatrix4(this_.pointcloud_.matrixWorld).center).multiplyScalar(-1);
										reFrame.updateMatrixWorld(true);
										reFrame.applyMatrix(new THREE.Matrix4().set(1,0,0,0,0,0,1,0,0,-1,0,0,0,0,0,1	));
						});
			},
			setHeadUpDisplay : function ( ){if (! this.options.headsUpDisplay_) return;					 
						var this_	 = this;
						this_.doSVGText(this_.options.headsUpDisplay_.etxt, this_.options.headsUpDisplay_.id); 
				
						if (!! this_.options.headsUpDisplay_.frame)
							this_.doSVGImg(this_.options.headsUpDisplay_.frame, this_.options.headsUpDisplay_.id); 
			},
			setJSONCad : function(  ) {		
						var this_	= this;
						try  {	
					 	  		var r	=	new Function(  document.getElementById(this.options.csgScript_).textContent + "\ndebugger;\n return (new CSG()).union(main());" )();

					 	  					if(typeof(r) != "object"    || ( r  instanceof Array && r.length <  1 ) || (! r instanceof Array &&  ! r instanceof CSG  )) 
												throw new Error("Your main() function does not return valid data.");

					 	  		if( r  instanceof Array){ 	r = r.map(function(el){		return (el instanceof CSG  ) ? { data : elem} : elem; }); 
					 	  									r.forEach(function(el){     if(! ("data" in el) || (!  el.data instanceof CSG ))										
																								throw new Error("Your main() function does not return valid data."); });
					 	  		}
 					 	  		var res			=	THREE.CSG.fromCSG(r, this_.options.defaultColor_); 
						  							res.wireframe.userData	= {lines: true};
					 	  							this_.scene_.add.apply(this_.scene_, [].concat(res.colorMesh).map(function(mesh) {	mesh.userData = {faces: true};	return mesh;	}));
					 	  							this_.scene_.add(res.wireframe);
					 	  							this_.scene_.children.filter(function(ch) { return ch.userData.faces; }).forEach(function(faceMesh) { faceMesh.visible = !! this_.options.drawOptions_.faces;	}, this_);
													if(this_.options.cameraStart_ == 'f') this_.toFrontView( );
			
						} catch(e) {  var errtxt = e.toString(); if(e.stack)  errtxt += '\nStack trace:\n'+e.stack;		 prompt(errtxt,errtxt); }
			}
};
