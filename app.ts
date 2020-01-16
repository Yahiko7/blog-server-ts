import { Container } from 'inversify'
import { InversifyKoaServer, TYPE} from 'inversify-koa-utils'
import { buildProviderModule } from 'inversify-binding-decorators'
import 'reflect-metadata';

const container = new Container();
container.load(buildProviderModule())

const server = new InversifyKoaServer(container)

const app = server.build();

app.listen(3000, () => {
  console.log("server at port: 3000")
})