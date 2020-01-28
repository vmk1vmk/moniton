# monitoring-dashboard
[![Grafana](https://img.shields.io/badge/Grafana-6.6.0-blue)](https://grafan.com)
[![Grafana](https://img.shields.io/badge/Docker-≥19.03.5-blue)](https://docs.docker.com)

This is the **T-Online Web Delivery [Monitoring Dashboard]()** 

## Setup

In order to work on the dashboard locally you need to install [docker](https://docs.docker.com/) and [docker-compose](https://docs.docker.com/compose/).

## Project Structure

```sh
plugins/        # grafana plugin directory, gets picked up by docker-compose
```

## Credentials

// TODO(vitalij): Find out what credentials should go where

## Development

Start te dashoard by executing `docker-compose up` in the project root.

After that navigate to [`localhost:8080`](http://localhost:8080) and enter following credentials:

|  |   |
| --- | ---
| **Username** | `admin`
| **Password** | `admin`

## Grafana Documentation

### Docker Image
[Documentation](https://grafana.com/docs/grafana/latest/installation/docker/)

The configuration of the docker image and internal environment variables is located in the `docker-compose.yml` file.

### Installing Plugins
[Documentation](https://grafana.com/docs/grafana/latest/plugins/installation/#install-plugin-on-local-grafana)

Download the Plugin `.zip` File and move it to the `plugins/` directory.

[]()
[]()
[]()

## Deployment

// TODO(vitalij): Decide where, how and in what shape to host the production dashboard.