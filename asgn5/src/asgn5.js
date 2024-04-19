import * as THREE from '../lib/three.module.js';
import { OBJLoader } from '../lib/OBJLoader.js';
import { MTLLoader } from '../lib/MTLLoader.js';

function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 5;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = 2;

	const scene = new THREE.Scene();

    {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(
            '../assets/blueSky.jpg',
            () => {

                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.colorSpace = THREE.SRGBColorSpace;
                scene.background = texture;

            } );
    }

	{

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( - 1, 2, 4 );
		scene.add( light );

	
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
		cube.position.set(0.25,0,0);
		scene.add( cube );
		cubes.push(cube);

	}

	{
		const geometry = new THREE.ConeGeometry( 0.5, 0.5, 32); 
		const material = new THREE.MeshBasicMaterial( {color: 0x800080} );
		const cone = new THREE.Mesh(geometry, material );
		cone.position.set(2,0,0);
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
		
		cylinder.position.set(-1.5, 0, 0);
		
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
