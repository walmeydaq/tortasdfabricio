# Sistema de Pedidos para Tortas D'Fabricio - Equipo 09

Práctica calificada: integración y entrega continua con Angular y GitHub Actions.

## Integrantes

- Almeyda Quispe Walter Hernán (Líder Técnico y Scrum Master)
- Zavaleta Pascual Meyder Smit (Desarrolladora Backend 1 - Módulo Clientes)
- Lopez Huamani Nicole Lisset (Desarrollador Backend 2 - Módulo Servicios)
- Gutierrez Orihuela Jaquelin Aurelia (Desarrollador Backend 3 - Módulo Reservas)
- Chipana Choccña Kevin (Integración y QA)

## Entregables

1. Repositorio: https://github.com/walmeydaq/tortasdfabricio
2. Aplicación desplegada: completar con la URL del hosting después del primer deploy exitoso. La ruta directa del formulario es `/registro`.
3. Workflow: [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml)
4. Evidencias de GitHub Actions: pestaña Actions del repositorio (corrida verde, corrida roja por la prueba y corrida verde después de la corrección).
5. Flujo: el detalle está en la sección siguiente.

## Qué hace la aplicación

Formulario de registro de cliente en la ruta `/registro`, hecho con Reactive Forms.

| Campo | Reglas |
| --- | --- |
| Nombre completo | Obligatorio y mínimo 3 caracteres |
| Correo | Obligatorio y formato de correo |
| Teléfono | Obligatorio. Celular de 9 dígitos que empieza con 9 |

El botón **Registrar cliente** permanece deshabilitado mientras el formulario es inválido. Si se intenta enviar con datos inválidos, no se muestra el mensaje de registro correcto.

## Cómo ejecutarlo en local

Requisitos: Node.js 20 o superior, Google Chrome y Angular CLI 19.

```bash
npm ci
npm start
```

Abrir `http://localhost:4200/registro`.

Pruebas:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Deben pasar las cinco pruebas del formulario y las dos de la aplicación. El archivo de pruebas es `src/app/registro/registro.component.spec.ts`.

Build de producción:

```bash
npm run build -- --base-href /
```

El resultado queda en `dist/tortasdfabricio/browser`. Esos archivos (`index.html`, JavaScript, CSS, favicon y `.htaccess`) son los que se publican. No se publica el código fuente: el navegador no ejecuta TypeScript, `node_modules` no sirve en el servidor y las pruebas junto con la estructura interna no deben quedar expuestas.

## Flujo de CI/CD

```text
Push a main o Pull Request hacia main
        |
        v
CI: obtener código, Node 20, Chrome, npm ci, pruebas, build, artefacto
        |
        +-- pruebas fallan --> el workflow se detiene y no hay deploy
        |
        v
CD: solo si el evento es push y la rama es main
        |
        v
FTP del contenido de dist/tortasdfabricio/browser
```

- `on` define cuándo arranca el workflow: push a `main` y pull request hacia `main`.
- `jobs` son dos trabajos. `integracion` es la integración continua. `entrega` es la entrega continua.
- `steps` son los pasos de cada job, en orden.
- `uses` ejecuta una acción publicada: checkout, setup-node, Chrome, artefacto o FTP.
- `run` ejecuta un comando: `npm ci`, `npm test` o `npm run build`.
- `needs: integracion` hace que el deploy espere al CI. Si una prueba falla, GitHub no ejecuta el job de entrega.
- Un pull request ejecuta el CI y omite el deploy porque el job `entrega` exige `github.event_name == 'push'` y `github.ref == 'refs/heads/main'`.

## Secrets

Las credenciales no están en el YAML. Se crean en GitHub, en Settings, Secrets and variables, Actions:

- `FTP_SERVER`: host, sin `ftp://`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_SERVER_DIR`: carpeta remota, por ejemplo `public_html/`

Si el hosting exige TLS, en el workflow cambiar `protocol: ftp` por `protocol: ftps`.

## Rutas al recargar

`public/.htaccess` se copia al build. Apache reescribe cualquier ruta que no sea un archivo real hacia `index.html`, para que `https://dominio/registro` cargue la aplicación Angular.

## Evidencia de una prueba fallida

El commit `Alterar validacion de nombre para evidenciar fallo` cambia el mínimo del nombre de 3 a 50 caracteres. La prueba que usa `Ana Perez` falla y el pipeline se detiene antes del build y del deploy. El commit `Corregir validacion de nombre` vuelve el mínimo a 3. Las pruebas no se eliminan.

## Versión publicada

El encabezado muestra `Versión 1.0.1`. Después de un deploy exitoso, esa versión debe verse en el servidor.
