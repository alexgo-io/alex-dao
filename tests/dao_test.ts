import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v0.14.0/index.ts";
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const daoAddress = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.executor-dao";
const bootstrapAddress =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp000-bootstrap";
const agp029Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp029";               
const agp030Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp030";   
const agp031Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp031";   
const agp035Address =
  "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE.agp035";                   


class DAO {
  chain: Chain;
  deployer: Account;

  constructor(chain: Chain, deployer: Account) {
    this.chain = chain;
    this.deployer = deployer;
  }

  construct(sender: Account, contract: string) {
    let block = this.chain.mineBlock([
      Tx.contractCall(
        "executor-dao",
        "construct",
        [types.principal(contract)],
        sender.address
      ),
    ]);
    return block.receipts[0].result;
  }

  executiveAction(sender: Account, contract: string) {
    let block = this.chain.mineBlock([
      Tx.contractCall(
        "age003-emergency-execute",
        "executive-action",
        [types.principal(contract)],
        sender.address
      ),
    ]);
    return block.receipts[0].result;
  }

  transferToken(
    sender: Account,
    token: string,
    amount: number,
    receiver: string,
    memo: ArrayBuffer
  ) {
    let block = this.chain.mineBlock([
      Tx.contractCall(
        token,
        "transfer-fixed",
        [
          types.uint(amount),
          types.principal(sender.address),
          types.principal(receiver),
          types.some(types.buff(memo)),
        ],
        sender.address
      ),
    ]);
    return block.receipts[0].result;
  }

  mintToken(
    sender: Account,
    token: string,
    amount: number,
    receiver: string
  ) {
    let block = this.chain.mineBlock([
      Tx.contractCall(
        token,
        "mint-fixed",
        [
          types.uint(amount),
          types.principal(receiver)
        ],
        sender.address
      ),
    ]);
    return block.receipts[0].result;
  }  
}

/**
 * dao test cases
 *
 */

Clarinet.test({
  name: "DAO: agp029/30/31",

  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let DAOTest = new DAO(chain, deployer);

    let result: any = await DAOTest.construct(deployer, bootstrapAddress);
    result.expectOk();

    result = await DAOTest.transferToken(
      deployer,
      "token-wstx",
      1_000_000e8,
      daoAddress,
      new ArrayBuffer(4)
    );
    result.expectOk();

    result = await DAOTest.mintToken(
      deployer,
      "token-banana",
      50_000e8,
      daoAddress
    );
    result.expectOk();    

    result = await DAOTest.executiveAction(deployer, agp029Address);
    result.expectOk();
    result = await DAOTest.executiveAction(deployer, agp030Address);
    result.expectOk();    
    result = await DAOTest.executiveAction(deployer, agp031Address);
    result.expectOk();    


    let call = chain.callReadOnlyFn(
      "alex-launchpad-v1-1",
      "get-ido",
      [types.uint(0)],
      deployer.address
    );
    call.result.expectOk().expectSome();
    console.log(call.result);
  },
});

 Clarinet.test({
  name: "DAO: agp035",

  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let DAOTest = new DAO(chain, deployer);

    let result: any = await DAOTest.construct(deployer, bootstrapAddress);
    result.expectOk();

    result = await DAOTest.mintToken(
      deployer,
      "token-banana",
      50_000e8,
      daoAddress
    );
    result.expectOk();    

    result = await DAOTest.executiveAction(deployer, agp035Address);
    console.log(result);
  },
});
