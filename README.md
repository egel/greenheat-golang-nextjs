## GreenHeat Code Challenge

<div align="center">
    <img src="https://i.imgur.com/hxfStBo.png"
      title="GreenHeat Code Challenge"
      width="100%"
      height="auto"
      style="max-width: 500px; text-align: center; border-radius: 12px; overflow:hidden;"
      referrerpolicy="no-referrer"
    />
</div>

## Run project

Requirements:

-   docker
-   docker-compose
-   golang <= 1.23.2
-   node <= 20

```bash
# copy .env.example to .env (adjust to the needs; by default work in dev mode)
cp .env.example .env

# start detached
docker compose up -d
```

To start each service separately visit the following pages:

-   [server](./server/README.md)
-   [webapp](./webapp/README.md)

## License

BSD 3-Clause License
