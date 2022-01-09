

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';

const daoAddress = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.executor-dao";
const bootstrapAddress = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp000-bootstrap";
const agp002Address = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp002-launchpad-alex";
const age000Address = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.age000-governance-token";

class DAO {
    chain: Chain;
    deployer: Account;
  
    constructor(chain: Chain, deployer: Account) {
      this.chain = chain;
      this.deployer = deployer;
    }  

    construct(sender: Account, contract: string) {
      let block = this.chain.mineBlock([
          Tx.contractCall("executor-dao", "construct", [
            types.principal(contract)
          ], sender.address),
        ]);
        return block.receipts[0].result;
    }
    
    executiveAction(sender: Account, contract: string) {
      let block = this.chain.mineBlock([
        Tx.contractCall("age003-emergency-execute", "executive-action", [
          types.principal(contract)
        ], sender.address),
      ]);
      return block.receipts[0].result;      
    }  
}

/**
 * dao test cases
 * 
 */

Clarinet.test({
    name: "DAO: bootstrap",

    async fn(chain: Chain, accounts: Map<string, Account>) {
        let deployer = accounts.get("deployer")!;
        let DAOTest = new DAO(chain, deployer);

        let result:any = await DAOTest.construct(deployer, bootstrapAddress);
        result.expectOk();

        result = await DAOTest.executiveAction(deployer, agp002Address);
        result.expectOk();

        let call = chain.callReadOnlyFn("alex-launchpad", "get-listing-details", [ types.principal(age000Address)], deployer.address);
        call.result.expectSome();
      }
    },    
);
