import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types,
} from "https://deno.land/x/clarinet@v0.31.1/index.ts";
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const deployerAddress = "ST1HTBVD3JG9C05J7HBJTHGR0GGW7KXW28M5JS8QE";
const bootstrapAddress = deployerAddress + ".agp000-bootstrap";

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

// Clarinet.test({
//   name: "DAO: agp029/30/31",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk();

//     result = await DAOTest.transferToken(
//       deployer,
//       "token-wstx",
//       1_000_000e8,
//       daoAddress,
//       new ArrayBuffer(4)
//     );
//     result.expectOk();

//     result = await DAOTest.mintToken(
//       deployer,
//       "token-banana",
//       50_000e8,
//       daoAddress
//     );
//     result.expectOk();    

//     result = await DAOTest.executiveAction(deployer, agp029Address);
//     result.expectOk();
//     result = await DAOTest.executiveAction(deployer, agp030Address);
//     result.expectOk();    
//     result = await DAOTest.executiveAction(deployer, agp031Address);
//     result.expectOk();    


//     let call = chain.callReadOnlyFn(
//       "alex-launchpad-v1-1",
//       "get-ido",
//       [types.uint(0)],
//       deployer.address
//     );
//     call.result.expectOk().expectSome();
//     console.log(call.result);
//   },
// });

//  Clarinet.test({
//   name: "DAO: agp035/36",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk();

//     result = await DAOTest.mintToken(
//       deployer,
//       "token-banana",
//       50_000e8,
//       daoAddress
//     );
//     result.expectOk();    

//     result = await DAOTest.executiveAction(deployer, agp035Address);
//     result.expectOk();
//     result = await DAOTest.executiveAction(deployer, agp036Address);
//     result.expectOk();
//   },
// });

// Clarinet.test({
//   name: "DAO: agp039",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, agp039Address);
//     result.expectOk();
//   },
// });

// Clarinet.test({
//   name: "DAO: agp039",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, agp039Address);
//     result.expectOk();

//     let call: any = chain.callReadOnlyFn("age004-claim-and-stake", "buff-to-uint", [types.buff(new Uint8Array([0x01]).buffer)], deployer.address);
//     call.result.expectUint(1);

//     result = chain.mineBlock([
//       Tx.contractCall("age004-claim-and-stake", "claim-and-stake", 
//       [
//         types.principal(age003Address),
//         types.buff(new Uint8Array([0x01]).buffer)
//       ], deployer.address),
//       Tx.contractCall("age004-claim-and-stake", "claim-and-stake", 
//       [
//         types.principal(age004Address),
//         types.buff(new Uint8Array([0x01]).buffer)
//       ], deployer.address)      
//     ]);
//     result.receipts[0].result.expectErr().expectUint(3000);
//     result.receipts[1].result.expectErr().expectUint(2026);
//   },
// });

// Clarinet.test({
//   name: "DAO: agp040",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, deployerAddress + ".agp040");
//     result.expectOk();
//   },
// });

// Clarinet.test({
//   name: "DAO: agp042",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk();

//     result = await DAOTest.mintToken(
//       deployer,
//       "token-usda",
//       100_000e8,
//       daoAddress
//     );
//     result.expectOk();    

//     result = await DAOTest.executiveAction(deployer, deployerAddress + ".agp042");
//     result.expectOk();
//   },
// });

// Clarinet.test({
//   name: "DAO: agp044",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp044");
//     result.expectOk();

//     let call: any = chain.callReadOnlyFn("age005-claim-and-stake", "buff-to-uint", [types.buff(new Uint8Array([0x01]).buffer)], deployer.address);
//     call.result.expectUint(1);

//     result = chain.mineBlock([
//       Tx.contractCall("age005-claim-and-stake", "claim-and-stake", 
//       [
//         types.principal(age003Address),
//         types.buff(new Uint8Array([0x01]).buffer)
//       ], deployer.address),
//       Tx.contractCall("age005-claim-and-stake", "claim-and-stake", 
//       [
//         types.principal(deployer.address + ".age005-claim-and-stake"),
//         types.buff(new Uint8Array([0x01]).buffer)
//       ], deployer.address)      
//     ]);
//     result.receipts[0].result.expectErr().expectUint(3000);
//     result.receipts[1].result.expectErr().expectUint(2026);
//   },
// });

// Clarinet.test({
//     name: "DAO: agp045",

//     async fn(chain: Chain, accounts: Map<string, Account>) {
//       let deployer = accounts.get("deployer")!;
//       let DAOTest = new DAO(chain, deployer);
  
//       let result: any = await DAOTest.construct(deployer, bootstrapAddress);  
//       result.expectOk();  

//       result = await DAOTest.executiveAction(deployer, deployerAddress + ".agp045");    
//       result.expectOk();
//     },
//   });          

// Clarinet.test({
//   name: "DAO: agp046",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk();

//     result = await DAOTest.mintToken(
//       deployer,
//       "token-slime",
//       360_000e8,
//       daoAddress
//     );
//     result.expectOk();    

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp046");
//     result.expectOk();
//   },
// });

// // Clarinet.test({
// //   name: "DAO: agp047/049",

// //   async fn(chain: Chain, accounts: Map<string, Account>) {
// //     let deployer = accounts.get("deployer")!;
// //     let DAOTest = new DAO(chain, deployer);

// //     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
// //     result.expectOk();

// //     result = await DAOTest.mintToken(
// //       deployer,
// //       "age000-governance-token",
// //       200_000e8,
// //       daoAddress
// //     );
// //     result.expectOk();
// //     let block = chain.mineBlock(
// //       [
// //       Tx.contractCall("alex-reserve-pool", "add-token", 
// //         [types.principal(deployer.address + ".age000-governance-token")],
// //         deployer.address
// //       ),
// //       Tx.contractCall("alex-reserve-pool", "set-activation-block",
// //         [
// //           types.principal(deployer.address + ".age000-governance-token"),
// //           types.uint(0)
// //         ],
// //         deployer.address
// //       ),
// //       Tx.contractCall("alex-reserve-pool", "set-coinbase-amount",
// //         [
// //           types.principal(deployer.address + ".age000-governance-token"),
// //           types.uint(1e8),
// //           types.uint(1e8),
// //           types.uint(1e8),
// //           types.uint(1e8),
// //           types.uint(1e8),
// //         ],
// //         deployer.address
// //       )
// //       ]
// //     );
// //     block.receipts.forEach((e) => { e.result.expectOk() });    

// //     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp039");
// //     result.expectOk();

// //     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp047");
// //     result.expectOk();    
// //     chain.mineEmptyBlockUntil(57626);

// //     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp049");
// //     result.expectOk();    
// //   },
// // });

// Clarinet.test({
//   name: "DAO: agp052",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.transferToken(
//       deployer,
//       "token-wstx",
//       50_000e8,
//       daoAddress,
//       new ArrayBuffer(4)
//     );
//     result.expectOk();

//     result = await DAOTest.mintToken(
//       deployer,
//       "token-xusd",
//       50_000e8,
//       daoAddress
//     );
//     result.expectOk();     

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp052");
//     result.expectOk();

//   },
// });

// Clarinet.test({
//   name: "DAO: agp053/54/55",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp053");
//     result.expectOk();

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp054");
//     result.expectOk();    
//     // result = await DAOTest.executiveAction(deployer, deployer.address + ".agp055");
//     // result.expectOk();        
//   },
// });

// Clarinet.test({
//   name: "DAO: agp058/59",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp058");
//     result.expectOk();   
//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp059");
//     result.expectOk();       
//   },
// });

// Clarinet.test({
//   name: "DAO: agp060/062",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp060");
//     result.expectOk();
//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp062");
//     result.expectOk();    
//   },
// });

// Clarinet.test({
//   name: "DAO: agp061",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.transferToken(
//       deployer,
//       "token-wstx",
//       9165650000000 + 9165650000000,
//       daoAddress,
//       new ArrayBuffer(4)
//     );
//     result.expectOk();

//     result = await DAOTest.mintToken(
//       deployer,
//       "token-mia",
//       2688911400000000,
//       daoAddress
//     );
//     result.expectOk();      

//     result = await DAOTest.mintToken(
//       deployer,
//       "token-nycc",
//       6318941800000000,
//       daoAddress
//     );
//     result.expectOk();        

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp061");
//     result.expectOk();
//   },
// });

// Clarinet.test({
//   name: "DAO: agp063",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp063");
//     result.expectOk();
//   },
// });

// Clarinet.test({
//   name: "DAO: agp064",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp064");
//     result.expectOk();
//   },
// });

// Clarinet.test({
//   name: "DAO: agp065",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp065");
//     result.expectOk();
//   },
// });

// Clarinet.test({
//   name: "DAO: agp066",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk();

//     let block = chain.mineBlock(
//       [
//         Tx.contractCall("auto-alex", "mint-fixed", [types.uint(3_200e8), types.principal(daoAddress)], deployer.address),
//         Tx.contractCall("auto-alex", "mint-fixed", [types.uint(10_000_000e8), types.principal(deployer.address)], deployer.address),
//         Tx.contractCall("age000-governance-token", "mint-fixed", [types.uint(10_000_000e8), types.principal(deployer.address)], deployer.address),
//         Tx.contractCall("simple-weight-pool-alex", "create-pool", 
//         [
//           types.principal(deployer.address + '.age000-governance-token'),
//           types.principal(deployer.address + '.auto-alex'),
//           types.principal(deployer.address + '.fwp-alex-autoalex'),
//           types.principal(deployer.address + '.multisig-fwp-alex-autoalex'),
//           types.uint(10_000_000e8),
//           types.uint(10_000_000e8)
//         ], deployer.address),
//         Tx.contractCall("simple-weight-pool-alex", "set-start-block", [types.principal(deployer.address + '.age000-governance-token'), types.principal(deployer.address + '.auto-alex'),types.uint(0)], deployer.address),
//         Tx.contractCall("simple-weight-pool-alex", "set-oracle-enabled", [types.principal(deployer.address + '.age000-governance-token'), types.principal(deployer.address + '.auto-alex')], deployer.address),
//         Tx.contractCall("simple-weight-pool-alex", "set-oracle-average", [types.principal(deployer.address + '.age000-governance-token'), types.principal(deployer.address + '.auto-alex'),types.uint(0.95e8)], deployer.address),
//         Tx.contractCall("alex-vault", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),
//         Tx.contractCall("alex-reserve-pool", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),
//         Tx.contractCall("simple-weight-pool-alex", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),
//         Tx.contractCall("collateral-rebalancing-pool-v1", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),
//         Tx.contractCall("yield-token-pool", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),
//         Tx.contractCall("key-alex-autoalex", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),
//         Tx.contractCall("key-alex-autoalex-v1", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),
//         Tx.contractCall("yield-alex", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),
//         Tx.contractCall("yield-alex-v1", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),
//         Tx.contractCall("ytp-alex", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),
//         Tx.contractCall("ytp-alex-v1", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),   
//         Tx.contractCall("auto-yield-alex", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),
//         Tx.contractCall("auto-ytp-alex", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),             
//         Tx.contractCall("auto-key-alex-autoalex", "set-contract-owner", [types.principal(deployer.address + '.executor-dao')], deployer.address),             
//       ]
//     )
//     block.receipts.forEach((e) => { e.result.expectOk() });

//     chain.mineEmptyBlockUntil(64451);

//     block = chain.mineBlock([
//       Tx.contractCall("age003-emergency-execute", "executive-action", [types.principal(deployer.address + ".agp066")], deployer.address),
//     ]);
//     block.receipts[0].result.expectOk();
//     console.log(block.receipts[0].events);
//   },
// });

// Clarinet.test({
//   name: "DAO: agp069",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp069");
//     result.expectOk();
//   },
// });

// Clarinet.test({
//   name: "DAO: agp077",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.mintToken(
//       deployer,
//       "age000-governance-token",
//       26260e8,
//       daoAddress
//     );
//     result.expectOk();  

//     result = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp077");
//     result.expectOk();
//   },
// });

// // Clarinet.test({
// //   name: "DAO: agp081",

// //   async fn(chain: Chain, accounts: Map<string, Account>) {
// //     let deployer = accounts.get("deployer")!;
// //     let DAOTest = new DAO(chain, deployer);

// //     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
// //     result.expectOk(); 

// //     result = await DAOTest.mintToken(
// //       deployer,
// //       "fwp-wstx-wmia-50-50-v1-01",
// //       100e8,
// //       daoAddress
// //     );
// //     result.expectOk();

// //     result = await DAOTest.mintToken(
// //       deployer,
// //       "fwp-wstx-wnycc-50-50-v1-01",
// //       100e8,
// //       daoAddress
// //     );
// //     result.expectOk();           

// //     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp081");
// //     result.expectOk();
// //   },
// // });

// Clarinet.test({
//   name: "DAO: agp082",

//   async fn(chain: Chain, accounts: Map<string, Account>) {
//     let deployer = accounts.get("deployer")!;
//     let DAOTest = new DAO(chain, deployer);

//     let result: any = await DAOTest.construct(deployer, bootstrapAddress);
//     result.expectOk(); 

//     result = await DAOTest.transferToken(
//       deployer,
//       "token-wstx",
//       51266e8,
//       daoAddress,
//       new ArrayBuffer(4)
//     );
//     result.expectOk();

//     result = await DAOTest.mintToken(
//       deployer,
//       "auto-alex",
//       84401e8,
//       daoAddress
//     );
//     result.expectOk();

//     result = await DAOTest.mintToken(
//       deployer,
//       "token-mia",
//       108469e8,
//       daoAddress
//     );
//     result.expectOk();      
    
//     result = await DAOTest.mintToken(
//       deployer,
//       "token-nycc",
//       201016e8,
//       daoAddress
//     );
//     result.expectOk(); 

//     result = await DAOTest.mintToken(
//       deployer,
//       "token-slime",
//       39842e8,
//       daoAddress
//     );
//     result.expectOk();    
    
//     result = await DAOTest.mintToken(
//       deployer,
//       "token-diko",
//       78687e8,
//       daoAddress
//     );
//     result.expectOk();       

//     result = await DAOTest.executiveAction(deployer, deployer.address + ".agp082");
//     result.expectOk();
//   },
// });

Clarinet.test({
  name: "DAO: age009, agp091, agp092, agp093, agp094, agp097, agp098, agp099",

  async fn(chain: Chain, accounts: Map<string, Account>) {
    let deployer = accounts.get("deployer")!;
    let wallet_1 = accounts.get("wallet_1")!;
    let DAOTest = new DAO(chain, deployer);

    // let result: any = await DAOTest.mintToken(
    //   deployer,
    //   "age000-governance-token",
    //   10000e8,
    //   daoAddress
    // );
    // result.expectOk();  

    let result: any = await DAOTest.construct(deployer, bootstrapAddress);
    result.expectOk(); 

    result = await DAOTest.executiveAction(deployer, deployer.address + ".agp091");
    result.expectOk();
  
    result = await DAOTest.executiveAction(deployer, deployer.address + ".agp092");
    result.expectOk();

    result = await DAOTest.executiveAction(deployer, deployer.address + ".agp093");
    result.expectOk();

    result = await DAOTest.executiveAction(deployer, deployer.address + ".agp094");
    result.expectOk();  

    result = await DAOTest.executiveAction(deployer, deployer.address + ".agp097");
    result.expectOk();      

    result = await DAOTest.executiveAction(deployer, deployer.address + ".agp098");
    result.expectOk();          

    result = await DAOTest.executiveAction(deployer, deployer.address + ".agp099");
    result.expectOk();              

    console.log(result);
  },
});