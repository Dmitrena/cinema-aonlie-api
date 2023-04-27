import { PartialType } from '@nestjs/mapped-types';
import { ActorDto } from './create-actor.dto';

export class UpdateActorDto extends PartialType(ActorDto) {}
