import { ReflectMetadata } from '@nestjs/common';

export const Capabilities = (...capabilities: string[]) => ReflectMetadata('capabilities', capabilities);

// export const capabilitiesProvider = [
//     {
//       provide: 'Capabilities',
//       useValue: Capabilities
//     },
//   ];