import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useApp, useScene, usePhysics, useActivate, useParticleSystem, useLocalPlayer, useFrame, useWear, useUse, useCleanup, getNextInstanceId} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

const emptyArray = [];
const fnEmptyArray = () => emptyArray;

const localVector = new THREE.Vector3();

// const urlPrefix = `https://webaverse.github.io/fx-textures/`;
// const _makeNameUrl = name => `${urlPrefix}${name}-spritesheet.ktx2`;
const particleName = 'Elements - Energy 017 Charge Up noCT noRSZ.mov';
const explosionName = 'Elements - Energy 119 Dissapear noCT noRSZ.mov';
const explosion2Name = 'Elements - Explosion 014 Hit Radial MIX noCT noRSZ.mov';
const particleNames = [
  particleName,
  explosionName,
  explosion2Name,
];

export default e => {
  const app = useApp();
  const scene = useScene();
  // const physics = usePhysics();
  const particleSystem = useParticleSystem();

  app.name = 'flower';

  let flowerApp = null;
  e.waitUntil(Promise.all(particleNames.map(particleName => particleSystem.preload(particleName)).concat([
    (async () => {
      let u2 = `${baseUrl}Group2_Orchid.glb`;
      const m = await metaversefile.import(u2);
      flowerApp = metaversefile.createApp({
        name: u2,
      });
      flowerApp.position.copy(app.position);
      flowerApp.quaternion.copy(app.quaternion);
      flowerApp.scale.copy(app.scale);
      flowerApp.updateMatrixWorld();
      flowerApp.name = 'flower';
      flowerApp.getPhysicsObjectsOriginal = flowerApp.getPhysicsObjects;
      flowerApp.getPhysicsObjects = fnEmptyArray;
      
      const components = [
        {
          "key": "instanceId",
          "value": getNextInstanceId(),
        },
        {
          "key": "contentId",
          "value": u2,
        },
        {
          "key": "physics",
          "value": true,
        },
        {
          "key": "wear",
          "value": {
            "boneAttachment": "leftHand",
            "position": [0, 0, 0],
            "quaternion": [0.4999999999999999, -0.5, -0.5, 0.5000000000000001]
          }
        },
        {
          "key": "aim",
          "value": {}
        },
        {
          "key": "use",
          "value": {
            "animation": "magic",
            "boneAttachment": "leftHand",
            "position": [0, 0, 0],
            "quaternion": [0.4999999999999999, -0.5, -0.5, 0.5000000000000001],
            "scale": [1, 1, 1]
          }
        }
      ];
      
      for (const {key, value} of components) {
        flowerApp.setComponent(key, value);
      }
      await flowerApp.addModule(m);
      scene.add(flowerApp);
      
      flowerApp.addEventListener('use', e => {
        console.log('flower use');
      });
    })()
  ])));

  class ParticleEmitter extends THREE.Object3D {
    constructor() {
      super();

      this.timeout = null;

      const now = performance.now()
      this.resetNextUpdate(now);
      this.particles = [];
    }
    resetNextUpdate(now) {
      this.lastParticleTimestamp = now;
      this.nextParticleDelay = Math.random() * 100;
    }
    update(timestamp) {
      const localPlayer = useLocalPlayer();
      const now = timestamp;
      const timeDiff = now - this.lastParticleTimestamp;
      const particleTime = 1000;
      
      const _removeParticles = () => {
        this.particles = this.particles.filter(particle => {
          const timeDiff = now - particle.startTime;
          if (timeDiff < particleTime) {
            return true;
          } else {
            particle.destroy();
            return false;
          }
        });
      };
      _removeParticles();
      if (wearing) {
        const _addParticles = () => {
          if (timeDiff >= this.nextParticleDelay) {
            const particle = particleSystem.addParticle(particleName, {
              lifetime: particleTime,
            });
            particle.offset = new THREE.Vector3((-0.5 + Math.random()) * 2, (-0.5 + Math.random()) * 2, (-0.5 + Math.random()) * 2);
            this.particles.push(particle);

            this.resetNextUpdate(timestamp);
          }
        };
        _addParticles();
        const _updateParticles = () => {
          if (this.particles.length > 0) {
            /* localVector.set(0, Math.sin(timestamp/1000 * Math.PI * 2), 0.1)
              .applyQuaternion(localPlayer.quaternion); */
            for (const particle of this.particles) {
              particle.position.copy(localPlayer.position)
                .add(particle.offset)
                // .add(localVector);
              particle.update();
            }
          }
        };
        _updateParticles();
      }
    }
  }
  const particleEmitter = new ParticleEmitter();

  class ParticleEmitter2 extends THREE.Object3D {
    constructor() {
      super();

      this.timeout = null;

      const now = performance.now()
      this.resetNextUpdate(now);
      this.particles = [];
    }
    resetNextUpdate(now) {
      this.lastParticleTimestamp = now;
      this.nextParticleDelay = Math.random() * 100;
    }
    update(timestamp) {
      const localPlayer = useLocalPlayer();
      const now = timestamp;
      const timeDiff = now - this.lastParticleTimestamp;
      const particleTime = 1000;

      const _removeParticles = () => {
        this.particles = this.particles.filter(particle => {
          const timeDiff = now - particle.startTime;
          if (timeDiff < particleTime) {
            return true;
          } else {
            particle.destroy();
            return false;
          }
        });
      };
      _removeParticles();
      if (wearing) {
        const _addParticles = () => {
          if (timeDiff >= this.nextParticleDelay) {
            const particle = particleSystem.addParticle(explosionName, {
              lifetime: particleTime,
            });
            particle.offset = new THREE.Vector3((-0.5 + Math.random()) * 2, (-0.5 + Math.random()) * 2, (-0.5 + Math.random()) * 2);
            this.particles.push(particle);

            this.resetNextUpdate(timestamp);
          }
        };
        _addParticles();
        const _updateParticles = () => {
          if (this.particles.length > 0) {
            for (const particle of this.particles) {
              particle.position.copy(localPlayer.position)
                .add(particle.offset)
              particle.update();
            }
          }
        };
        _updateParticles();
      }
    }
  }
  const particleEmitter2 = new ParticleEmitter2();

  app.getPhysicsObjects = () => {
    return flowerApp ? flowerApp.getPhysicsObjectsOriginal() : [];
  };
  
  /* useActivate(() => {
    const localPlayer = useLocalPlayer();
    localPlayer.wear(app);
  }); */
  
  let wearing = false;
  useWear(e => {
    const {wear} = e;

    flowerApp.position.copy(app.position);
    flowerApp.quaternion.copy(app.quaternion);
    flowerApp.scale.copy(app.scale);
    flowerApp.updateMatrixWorld();
    
    flowerApp.dispatchEvent({
      type: 'wearupdate',
      wear,
    });

    wearing = wear;
  });
  
  useUse(e => {
    if (e.use && flowerApp) {
      flowerApp.use();
    }
  });

  useFrame(({timestamp}) => {
    if (!wearing) {
      if (flowerApp) {
        flowerApp.position.copy(app.position);
        flowerApp.quaternion.copy(app.quaternion);
        flowerApp.updateMatrixWorld();
      }
    } else {
      if (flowerApp) {
        app.position.copy(flowerApp.position);
        app.quaternion.copy(flowerApp.quaternion);
        app.updateMatrixWorld();
      }
    }

    particleEmitter.update(timestamp);
    particleEmitter2.update(timestamp);
  });
  
  useCleanup(() => {
    if (flowerApp) {
      scene.remove(flowerApp);
      flowerApp.destroy();
    }
  });
  
  return app;
};