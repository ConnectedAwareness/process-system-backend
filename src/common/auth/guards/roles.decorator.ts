import { ReflectMetadata, Guard, Injectable } from '@nestjs/common';

export const Roles = (...roles: string[]) => ReflectMetadata('roles', roles);

// export const rolesProvider = [
//     {
//       provide: 'Roles',
//       useValue: Roles
//     },
//   ];