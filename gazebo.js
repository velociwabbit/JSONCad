 
var  nodeext = {
 	 
	'GAZEBOS': {
 
			'GAZEBO'	: ['VOBJ', [1, null]					, [	{x:    0  ,y:   -6.5,z:   0	,r1: {axis: 1,degrees: -90},r2: {axis:   0,degrees:    0} ,size: [.15, .15, .15]}
	 											 				,	{x: -100  ,y:   2.0 ,z: -50	,r1: {axis: 1,degrees: -90},r2: {axis: 'y',degrees:    0},color: [0, 0, 1, 1],size: [.05, .05, .05]}
																]
				]
		 }
		,'POSTS'		:	[	'PIPE'	,[10,200,  1, null]		, [ {x:      0 ,y:  80 ,z:   0	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0  ,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}
																,	{x:  69.28 ,y:  40 ,z:   0	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0  ,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}
																,	{x:  69.28 ,y: -40 ,z:   0	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0  ,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}
																,	{x:   9.79 ,y: -80 ,z:   0	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0  ,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}
																,	{x: -69.28 ,y: -40 ,z:   0	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0  ,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}
																,	{x: -69.28 ,y:  40 ,z:   0	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0  ,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}
																]
							]
		,'ROOF'			: [	'CONE'	,[ 120, 80, 120, 0, 1,null ], [ {x: 0   ,y:  0 ,z: 200	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0  ,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}]]		
		,'HUTSECTION' : {
			 			'subtract' : { 		
														 
				 		'POST0'  : [	'PIPE'	,[ 100, 50 ,1, null]	, [ {x: 0	,y:  0 ,z: 0	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0	,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}]]														 
				 	 ,	'POST1'  : [	'PIPE'	,[ 80  ,50 ,  1, null]	, [ {x: 0	,y:  0 ,z: 10	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0	,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}]]														 
				 	 ,  'FLOOR'	 : [	'CUBE'	,[50, 50 , 50 ]			, [ {x: 100 ,y:  0 ,z: 35 	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0	,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}]]
				 	}																		 
		}																					 
		,'GAZEBO'	 : {																		 
					'HUTSECTION' :	 ['VOBJ', [  .5,null]			, [ {x: 0 ,y:  0 ,z: 0	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0  ,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}]]			 										 
 			 	 	,'ROOF' 	 :	 ['VOBJ', [  .5,null]			, [ {x: 0 ,y:  0 ,z: 0	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0  ,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}]]			 										 
			 	 	,'POSTS' 	 :	 ['VOBJ', [  .5,null]			, [ {x: 0 ,y:  0 ,z: 0	,r1: {axis: 0 ,degrees: 0 },r2: {axis: 0  ,degrees:   0 } ,size: [1,1,1],color: [1, 0, 1, 1]}]]
							}   
};
