## GreenHeat Code Challenge

<div align="center">
  <a href="https://i.imgur.com/hxfStBo.png" target="_blank" title="Code Challenge">
    <img src="https://i.imgur.com/hxfStBo.png"
      title="Grovbox dark and light themes for Tmux"
      width="100%"
      height="auto"
      style="max-width: 500px; text-align: center; border-radius: 12px; overflow:hidden;"
      referrerpolicy="no-referrer"
    />
  </a>
</div>

## Run project

Requirements:

-   docker
-   docker-compose
-   golang <= 1.23.2
-   node <= 20

```bash
# copy .env.example to .env (adjust to the needs)
cp .env.example .env

# start detached
docker compose up -d
```

## Development

Webapp (frontend):

```bash
cd webapp
npm run dev
```

## License

BSD 3-Clause License
