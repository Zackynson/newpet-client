import { PetAge } from './enums/pet-age.enum';
import { PetSize } from './enums/pet-size.enum';
import { PetType } from './enums/pet-type.enum';

export interface Owner {
	_id: string;
	name: string;
}

/**
 * Pets interface
 */
export interface Pet {
	_id?: string;

	name?: string;

	type?: PetType;

	breed?: string;

	address?: string;

	age?: PetAge;

	ownerId?: string;
	
	gender?: string;

	size?: PetSize;

	// populated from ownerId
	owner?: Owner;

  images?: string[];

	createdAt: string;

	updatedAt?: string;
}
