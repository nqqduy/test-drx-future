"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const user_enum_1 = require("../../../shares/enums/user.enum");
class CreateUserDto {
}
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 1,
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", Number)
], CreateUserDto.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: true,
        example: 'abcd@gmail.com',
    }),
    class_validator_1.IsNotEmpty(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
    }),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "position", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        enum: [user_enum_1.UserRole.ADMIN, user_enum_1.UserRole.SUPER_ADMIN, user_enum_1.UserRole.USER],
    }),
    class_validator_1.IsEnum(user_enum_1.UserRole),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        enum: [user_enum_1.UserType.RESTRICTED, user_enum_1.UserType.UNRESTRICTED],
    }),
    class_validator_1.IsEnum(user_enum_1.UserType),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "userType", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        enum: [user_enum_1.UserIsLocked.LOCKED, user_enum_1.UserIsLocked.UNLOCKED],
    }),
    class_validator_1.IsEnum(user_enum_1.UserIsLocked),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "isLocked", void 0);
tslib_1.__decorate([
    swagger_1.ApiProperty({
        required: false,
        enum: [user_enum_1.UserStatus.ACTIVE, user_enum_1.UserStatus.DEACTIVE],
    }),
    class_validator_1.IsEnum(user_enum_1.UserStatus),
    class_validator_1.IsOptional(),
    tslib_1.__metadata("design:type", String)
], CreateUserDto.prototype, "status", void 0);
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map