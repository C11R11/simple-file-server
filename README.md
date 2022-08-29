# Services

To run all services in localhost:

```bash
#First build all images 
docker compose build

#Then run the containers
docker compose up
```

>More info in the docker compose file

# simple-file-server

This is a simple file server ready for docker (and the smalles possible -27.7MB image-). Just tell the folder to share and it will offer in the simplest way possible.

This is mainly to provide some features quick. Is not meant for any serious deployment.

# fake rest

This is a fake rest api to serve a simple file folder

# Known issues

- Doesn't work well with multilevel folders (only tested on 1 level folder files)

# Masterplan

* Basic feature (done)
* Json format files listing to consume (to emulate a rest api to serve a file system.) (done)
* Stability
