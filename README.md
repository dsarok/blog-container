
# Nodejs application for monitoring and streaming large files



## Introduction

This project is used for streaming large size files and then monitoring its performance using monitoring tools.

- mysql is used as database and nodejs(express) for backend
- ejs template is being used for frontend
- open source monitoring tools are used such as prometheus, grafana and grafana loki

## Set up

- Clone my project using github

    ```bash
    git clone https://github.com/dsarok/blog-container.git
    cd blog-container
    ```

- inside the directory of blog-container use docker-compose up to spine-up the project
  ```bash
  docker-compose up 
  ```
#### monitoring tools grafana is running at localhost:3000 and prometheus is running at localhost:9090.

## note
- localhost can be different when running inside codespace therefore look inside port tab of the terminal to find the address of localhost.

- prometheus is running as prometheus(service named in docker-compose )
- grafana is running at localhost:3000

#### note- use http://prometheus:9090 in grafana as source of prometheus
## Features

- Downloading blogs files through streaming
- Can Debug the process using vscode editor
- CPU performance is monitored in the grafana dashboard
- Logs are in grafana loki

