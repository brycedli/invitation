import * as Physics from '/physics.js';
import * as THREE from 'three';

export const particleScale = 0.15;
export class Firework  {
    // TODO: Instanced mesh rendering if neccessary

    constructor(startingPosition, scene, texture) {
        this.lifeSpan = 1.5;
        this.clock = new THREE.Clock();
        this.startingPosition = startingPosition;
        this.particleCount = 200 + getRandomInt(20);
        this.physics = [];
        this.sprites = [];
        this.offsets = [];
        this.scene = scene;
        for (let i = 0; i < this.particleCount; i++) {
            let randomDirection = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5,
            ).multiplyScalar(3);
            let physicsObject = new Physics.Physics (this.startingPosition.clone(), randomDirection, 1);            
            let gravityVector = new THREE.Vector3(0, -1, 0);
            physicsObject.acceleration = gravityVector;
            this.physics.push(physicsObject); 
            const color = new THREE.Color(`hsl(${getRandomInt(60)}, 100%, ${50 + getRandomInt(30)}%)`);

            let particleMaterial = new THREE.SpriteMaterial( { 
                color:  color, 
                map: texture 
            } );
            let sprite = new THREE.Sprite( particleMaterial );
            this.sprites.push(sprite);
            this.offsets.push(10 * Math.random());
            scene.add( sprite );
        }
    }

    render (deltaTime) {
        for (let i = 0; i < this.particleCount; i++) {
            this.physics[i].step(deltaTime);
            this.sprites[i].position.set(
                this.physics[i].position.x, 
                this.physics[i].position.y, 
                this.physics[i].position.z,
            );
            let sparkle = Math.sin(2 * this.offsets[i] * this.clock.getElapsedTime() + this.offsets[i]);
            let scale = sparkle * particleScale * (1 - (this.clock.getElapsedTime() / this.lifeSpan));
            this.sprites[i].scale.set(
                scale,scale,scale
            )
            // if (i == 0) {
            //     console.log(this.sprites[i].position);
            // }
        }
        if (this.clock.getElapsedTime() > this.lifeSpan) {
            for (let i = 0; i < this.particleCount; i++) {
                this.sprites[i].material.dispose();
            }
            this.destroy();
        }
    }

    destroy () {
        for (let i = 0; i < this.particleCount; i++) {
            this.scene.remove( this.sprites[i] );
        }
    }
    // step (deltaTime) {
    //     this.physics.step(deltaTime);
    //     this.position = this.physics.position;
    // }
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  