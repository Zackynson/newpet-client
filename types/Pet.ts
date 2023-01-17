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

	birthDate?: string;

	ownerId?: string;

	size?: PetSize;

	// populated from ownerId
	owner?: Owner;

  images?: string[];

	createdAt: string;

	updatedAt?: string;
}
