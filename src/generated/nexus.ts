/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../context"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  MockEndpointCreateInput: { // input type
    charset: string; // String!
    httpHeaders: string; // String!
    httpMethod: string; // String!
    httpResponseBody: string; // String!
    httpStatus: number; // Int!
    responseContentType: string; // String!
    responseName: string; // String!
    timeout: number; // Int!
    urlPath: string; // String!
  }
  UserCreateInput: { // input type
    id?: string | null; // String
    isTemp?: boolean | null; // Boolean
  }
  UserGetInput: { // input type
    id: string; // String!
  }
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  MockEndpoint: { // root type
    charset: string; // String!
    httpHeaders: string; // String!
    httpMethod: string; // String!
    httpResponseBody: string; // String!
    httpStatus: number; // Int!
    id: number; // Int!
    responseContentType: string; // String!
    responseName: string; // String!
    timeout: number; // Int!
    urlPath: string; // String!
    userId: string; // String!
  }
  Mutation: {};
  Query: {};
  User: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    isTemp: boolean; // Boolean!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  MockEndpoint: { // field return type
    charset: string; // String!
    httpHeaders: string; // String!
    httpMethod: string; // String!
    httpResponseBody: string; // String!
    httpStatus: number; // Int!
    id: number; // Int!
    responseContentType: string; // String!
    responseName: string; // String!
    timeout: number; // Int!
    urlPath: string; // String!
    userId: string; // String!
  }
  Mutation: { // field return type
    createMockInput: NexusGenRootTypes['MockEndpoint']; // MockEndpoint!
    signupUser: NexusGenRootTypes['User']; // User!
  }
  Query: { // field return type
    getUserWithMockEndpoints: NexusGenRootTypes['User'] | null; // User
  }
  User: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // String!
    isTemp: boolean; // Boolean!
    mockEndpoints: Array<NexusGenRootTypes['MockEndpoint'] | null> | null; // [MockEndpoint]
  }
}

export interface NexusGenFieldTypeNames {
  MockEndpoint: { // field return type name
    charset: 'String'
    httpHeaders: 'String'
    httpMethod: 'String'
    httpResponseBody: 'String'
    httpStatus: 'Int'
    id: 'Int'
    responseContentType: 'String'
    responseName: 'String'
    timeout: 'Int'
    urlPath: 'String'
    userId: 'String'
  }
  Mutation: { // field return type name
    createMockInput: 'MockEndpoint'
    signupUser: 'User'
  }
  Query: { // field return type name
    getUserWithMockEndpoints: 'User'
  }
  User: { // field return type name
    createdAt: 'DateTime'
    id: 'String'
    isTemp: 'Boolean'
    mockEndpoints: 'MockEndpoint'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createMockInput: { // args
      data: NexusGenInputs['MockEndpointCreateInput']; // MockEndpointCreateInput!
      userId: string; // String!
    }
    signupUser: { // args
      data?: NexusGenInputs['UserCreateInput'] | null; // UserCreateInput
    }
  }
  Query: {
    getUserWithMockEndpoints: { // args
      data: NexusGenInputs['UserGetInput']; // UserGetInput!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}