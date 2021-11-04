import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserToken } from "./userToken";

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserToken) private readonly tokenRepository: Repository<UserToken>
  ) {
  }

  async save(options) {
    return this.tokenRepository.save(options);
  }

  async findOne(options) {
    return this.tokenRepository.findOne(options);
  }

  async delete(options) {
    return this.tokenRepository.delete(options);
  }
}
