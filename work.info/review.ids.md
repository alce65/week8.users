# Review IDs Type

## Entities

ProtoItem -> noId
Item -> id: string / relación `Types.ObjectId` | Array<`Types.ObjectId`>

Robot -> owner: `Types.ObjectId`;
User -> robots: Array<`Types.ObjectId`>;

## Repositories

type id = number | string;

Schema<Item>
No define explícitamente ID
Utiliza \_id: Types.ObjectId

Define las relaciones como `Types.ObjectId` | Array<`Types.ObjectId`>

Repository/robots.ts
{Linea 64: .populate<{ \_id: Types.ObjectId }>('owner')} //Eliminado

Robot.controller
user.robots.push(new Types.ObjectId(robot.id));
