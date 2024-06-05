import * as THREE from '../lib/three.module.js';
import { OrbitControls } from '../lib/OrbitControl.js';
import { OBJLoader } from '../lib/OBJLoader.js';
import { MTLLoader } from '../lib/MTLLoader.js';

function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 100;
	const aspect = 2; 
	const near = 0.1;
	const far = 10;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	// camera.position.z = 2;
	camera.position.set(0,2,4);
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 0, 0 );
	controls.update();

	const scene = new THREE.Scene();

	// fog
	// https://threejs.org/manual/#en/fog
	{
		const near = 1;
		const far = 7;
		const color = 'gray';
		scene.fog = new THREE.Fog( color, near, far );
		scene.background = new THREE.Color( color );

	}

	{

		const planeSize = 100;
  
		const loader = new THREE.TextureLoader();
		const texture = loader.load('../assets/sand.jpg');
		texture.encoding = THREE.sRGBEncoding;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		const repeats = planeSize / 2;
		texture.repeat.set(repeats, repeats);
	
		const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
		const planeMat = new THREE.MeshPhongMaterial({
		  map: texture,
		  side: THREE.DoubleSide,
		});
		const mesh = new THREE.Mesh(planeGeo, planeMat);
		mesh.receiveShadow = true;
		mesh.rotation.x = Math.PI * -.5;
		scene.add(mesh);
	  }

  	{
    	const loader = new THREE.TextureLoader();
    	const texture = loader.load(
      	'../assets/ggb.jpg',
      	() => {
        	const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        	rt.fromEquirectangularTexture(renderer, texture);
        	scene.background = rt.texture;
      	});
  	}

	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light1 = new THREE.DirectionalLight( color, intensity );
		light1.position.set( - 1, 2, 4 );
		scene.add( light1 );

	
	}

	{
		const color = 0xFFFFFF;
		const intensity = 150;
		const light2 = new THREE.PointLight( color, intensity );
		light2.position.set( 1, -2, -4 );
		scene.add( light2 );
	}

	{
		const color = 0xFFFFFF;
		const intensity = 150;
		const light3 = new THREE.PointLight( color, intensity );
		light3.position.set( -6, 2, -4 );
		scene.add( light3 );
	}

	{

		const color = 0xFFFFFF;
		const intensity = 150;
		const light = new THREE.SpotLight( color, intensity );
		light.position.set( 0, 7, 0 );
		light.target.position.set( - 5, 0, 0 );
		scene.add( light );
		scene.add( light.target );
	}
	const cubes = [];
	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(1,0.5,2);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(1,0.5,3);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(1,0.5,3.5);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(1,0.5,4);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(-2,0.5,2);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(-2,0.5,2.5);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(-2,0.5,3);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(-2,0.5,3.5);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(-2,0.5,4);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(-3,0.5,3);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(-4,0.5,3);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(-4,0.5,2);
		scene.add( cube );
		cubes.push(cube);
	}
	
	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(-4,0.5,2.5);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(-4,0.5,3.5);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(-4,0.5,4);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(3,0.5,2);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(3,0.5,2.5);
		scene.add( cube );
		cubes.push(cube);
	}

	{
		const boxWidth = 0.55;
		const boxHeight = 0.55;
		const boxDepth = 0.55;
		const geometry = new THREE.BoxGeometry( boxWidth, boxHeight, boxDepth );
		const loader = new THREE.TextureLoader();
		const material = new THREE.MeshPhongMaterial({map: loader.load('../assets/shinyMudkip.jpg')});
		const cube = new THREE.Mesh( geometry, material );
		cube.position.set(3,0.5,3);
		scene.add( cube );
		cubes.push(cube);
	}


	{
		const geometry = new THREE.ConeGeometry( 0.5, 0.5, 32); 
		const material = new THREE.MeshBasicMaterial( {color: 0x800080} );
		const cone = new THREE.Mesh(geometry, material );
		cone.position.set(0,0.84,1);
		scene.add( cone );
	}

	{
		const radiusTop = 0.25;
		const radiusBottom = 0.25;
		const height = 0.5;
		const radialSegments = 32;
		const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
		const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		const cylinder = new THREE.Mesh(geometry, material);
		
		cylinder.position.set(3, 0.5, 4);
		
		scene.add(cylinder);
	}

	// https://threejs.org/manual/#en/primitives

	{
		const geometry1 = new THREE.TetrahedronGeometry(1);
		const material1 = new THREE.MeshPhongMaterial({ color: 0xffc111 });
		const tetrahedron = new THREE.Mesh(geometry1, material1);
		tetrahedron.castShadow = true;
		tetrahedron.receiveShadow = true;
		tetrahedron.position.set(3, 1, 0);
		tetrahedron.rotation.y = 0;
		scene.add(tetrahedron);
		cubes.push(tetrahedron);
	}

	{
		const geometry1 = new THREE.IcosahedronGeometry(1);
		const material1 = new THREE.MeshPhongMaterial({ color: 0xcdb4db });
		const icosahedron = new THREE.Mesh(geometry1, material1);
		icosahedron.castShadow = true;
		icosahedron.receiveShadow = true;
		icosahedron.position.set(-5,0.5,0);
		scene.add(icosahedron);
		cubes.push(icosahedron);
		
	}

	{
		const geometry1 = new THREE.SphereGeometry(3, 8, -2)
		const material1 = new THREE.MeshPhongMaterial({ color: 0xbde0fe });
		const sphere = new THREE.Mesh(geometry1, material1);
		sphere.castShadow = true;
		sphere.receiveShadow = true;
		sphere.position.set(0, 0.84, -3);
		sphere.rotation.y = 0;
		scene.add(sphere);
		cubes.push(sphere);
	}

	{
		const geometry1 = new THREE.OctahedronGeometry(1);
		const material1 = new THREE.MeshPhongMaterial({ color: 0xffafcc });
		const ocatahedron = new THREE.Mesh(geometry1, material1);
		ocatahedron.castShadow = true;
		ocatahedron.receiveShadow = true;
		ocatahedron.position.set(5,1,0);
		ocatahedron.rotation.y = 0;
		scene.add(ocatahedron);
		cubes.push(ocatahedron);
	  }

	{
		const geometry1 = new THREE.TorusGeometry(1)
		const material1 = new THREE.MeshPhongMaterial({ color: 0xa2d2ff });
		const torus = new THREE.Mesh(geometry1, material1);
		torus.castShadow = true;
		torus.receiveShadow = true;
		torus.position.set(-3,1.5,-1);
		torus.rotation.y = 0;
		scene.add(torus);
		cubes.push(torus);
	}

	{
		// https://threejs.org/docs/#api/en/extras/core/Shape
		const heartShape = new THREE.Shape();

		heartShape.moveTo( 25, 25 );
		heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
		heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
		heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
		heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
		heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
		heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );
	
		const extrudeSettings = { 
		  depth: 8, 
		  bevelEnabled: true, 
		  bevelSegments: 2, 
		  steps: 2, 
		  bevelSize: 1, 
		  bevelThickness: 1 
		};

		const geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
		const mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: 0xFF0000}) );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.scale.set(.03, .03 , .03);
		mesh.rotation.x = -10;
		mesh.position.set(-2,2,5);
		scene.add(mesh);
		}

    {
        const mtlLoader = new MTLLoader();
        const objLoader = new OBJLoader();
        mtlLoader.load('../assets/Hamster_01.mtl', (mtl) => {
          mtl.preload();
          objLoader.setMaterials(mtl);
          objLoader.load('../assets/Hamster_01.obj', (root) => {
            root.traverse(function(child){child.castShadow = true;child.receiveShadow = true;});
            root.scale.set(1, 1, 1);
            root.position.set(0, 0.405, 1);
            scene.add(root);
          });
        });
    }

	makeLabel(400, 100, 'Hammy', [0, -2, 0]);

	 // https://threejs.org/manual/#en/billboards
	 function makeLabel(labelWidth, size, name, posxyz) {
		const canvas = makeLabelCanvas(labelWidth, size, name);
		const texture = new THREE.CanvasTexture(canvas);
	
		texture.minFilter = THREE.LinearFilter;
		texture.wrapS = THREE.ClampToEdgeWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;
	
		const labelMaterial = new THREE.SpriteMaterial({
		  map: texture,
		  transparent: true,
		});
	
		const root = new THREE.Object3D();
	
		const labelBaseScale = 0.01;
		const label = new THREE.Sprite(labelMaterial);
		root.add(label);
		label.position.x = posxyz[0];
		label.position.y = posxyz[1] + 4;
		label.position.z = posxyz[2];
	
		label.scale.x = canvas.width * labelBaseScale;
		label.scale.y = canvas.height * labelBaseScale;
	
		scene.add(root);
		return root;
	  }
	
	  function makeLabelCanvas(baseWidth, size, name) {
		const borderSize = 2;
		const ctx = document.createElement('canvas').getContext('2d');
		const font = `${size}px bold sans-serif`;
		ctx.font = font;
		// measure how long the name will be
		const textWidth = ctx.measureText(name).width;
	
		const doubleBorderSize = borderSize * 2;
		const width = baseWidth + doubleBorderSize;
		const height = size + doubleBorderSize;
		ctx.canvas.width = width;
		ctx.canvas.height = height;
	
		//resize
		ctx.font = font;
		ctx.textBaseline = 'middle';
		ctx.textAlign = 'center';
	
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, width, height);
	
		// scale to fit but don't stretch
		const scaleFactor = Math.min(1, baseWidth / textWidth);
		ctx.translate(width / 2, height / 2);
		ctx.scale(scaleFactor, 1);
		ctx.fillStyle = 'white';
		ctx.fillText(name, 0, 0);
	
		return ctx.canvas;
	  }

	function render( time ) {

		time *= 0.001; // convert time to seconds

		cubes.forEach( ( cube, ndx ) => {

			const speed = 1 + ndx * .1;
			const rot = time * speed;
			cube.rotation.x = rot;
			cube.rotation.y = rot;

		} );

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();
