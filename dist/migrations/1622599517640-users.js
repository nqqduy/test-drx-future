"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users1622599517640 = void 0;
const user_enum_1 = require("../shares/enums/user.enum");
const typeorm_1 = require("typeorm");
class users1622599517640 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'bigint',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    unsigned: true,
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'position',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'role',
                    type: 'varchar(20)',
                    isNullable: false,
                    default: `'${user_enum_1.UserRole.USER}'`,
                    comment: Object.keys(user_enum_1.UserRole).join(','),
                },
                {
                    name: 'userType',
                    type: 'varchar(20)',
                    isNullable: false,
                    default: `'${user_enum_1.UserType.UNRESTRICTED}'`,
                    comment: Object.keys(user_enum_1.UserType).join(','),
                },
                {
                    name: 'isLocked',
                    type: 'varchar(20)',
                    isNullable: true,
                    default: `'${user_enum_1.UserIsLocked.UNLOCKED}'`,
                    comment: Object.keys(user_enum_1.UserIsLocked).join(','),
                },
                {
                    name: 'status',
                    type: 'varchar(20)',
                    default: `'${user_enum_1.UserStatus.ACTIVE}'`,
                    comment: Object.keys(user_enum_1.UserStatus).join(','),
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);
        await queryRunner.createIndices('users', [
            new typeorm_1.TableIndex({
                columnNames: ['role'],
                isUnique: false,
                name: 'IDX-users-role',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['userType'],
                isUnique: false,
                name: 'IDX-users-userType',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['email'],
                isUnique: true,
                name: 'IDX-users-email',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['isLocked'],
                isUnique: false,
                name: 'IDX-users-isLocked',
            }),
            new typeorm_1.TableIndex({
                columnNames: ['status'],
                isUnique: false,
                name: 'IDX-users-status',
            }),
        ]);
    }
    async down(queryRunner) {
        if (await queryRunner.hasTable('users'))
            await queryRunner.dropTable('users');
    }
}
exports.users1622599517640 = users1622599517640;
//# sourceMappingURL=1622599517640-users.js.map