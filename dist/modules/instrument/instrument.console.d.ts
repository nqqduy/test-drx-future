import { InstrumentRepository } from 'src/models/repositories/instrument.repository';
export default class InstrumentSeedCommand {
    readonly instrumentRepository: InstrumentRepository;
    constructor(instrumentRepository: InstrumentRepository);
    seedInstrument(): Promise<void>;
}
