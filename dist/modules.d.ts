import { Logger } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { DatabaseCommonModule } from 'src/models/database-common';
declare const Modules: (typeof DatabaseCommonModule | import("@nestjs/common").DynamicModule | typeof Logger | typeof ConsoleModule)[];
export default Modules;
