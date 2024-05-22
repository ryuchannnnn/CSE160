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
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	// camera.position.z = 2;
	camera.position.set(0,2,4);
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 0, 0 );
	controls.update();

	const scene = new THREE.Scene();

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
		cube.position.set(0,0.5,0);
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
		cube.position.set(2,2.5,0);
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
		cube.position.set(-2,2.5,0);
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
		cube.position.set(-1,0.5,0);
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
		cube.position.set(-2,0.5,0);
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
		cube.position.set(-3,0.5,0);
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
		cube.position.set(-4,0.5,0);
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
		cube.position.set(-5,0.5,0);
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
		cube.position.set(-6,0.5,0);
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
		cube.position.set(-7,0.5,0);
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
		cube.position.set(-8,0.5,0);
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
		cube.position.set(1,0.5,0);
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
		cube.position.set(2,0.5,0);
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
		cube.position.set(3,0.5,0);
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
		cube.position.set(4,0.5,0);
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
		cube.position.set(5,0.5,0);
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
		cube.position.set(6,0.5,0);
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
		cube.position.set(7,0.5,0);
		scene.add( cube );
		cubes.push(cube);
	}


	{
		const geometry = new THREE.ConeGeometry( 0.5, 0.5, 32); 
		const material = new THREE.MeshBasicMaterial( {color: 0x800080} );
		const cone = new THREE.Mesh(geometry, material );
		cone.position.set(6,2,0);
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
		
		cylinder.position.set(-6, 2, 0);
		
		scene.add(cylinder);
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
