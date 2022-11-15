import { Signer, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { ItemPurchaseProxy, ItemPurchaseProxyInterface } from "../../payments/ItemPurchaseProxy";
declare type ItemPurchaseProxyConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class ItemPurchaseProxy__factory extends ContractFactory {
    constructor(...args: ItemPurchaseProxyConstructorParams);
    deploy(_firstOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): Promise<ItemPurchaseProxy>;
    getDeployTransaction(_firstOwner: PromiseOrValue<string>, overrides?: Overrides & {
        from?: PromiseOrValue<string>;
    }): TransactionRequest;
    attach(address: string): ItemPurchaseProxy;
    connect(signer: Signer): ItemPurchaseProxy__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b5060405161166638038061166683398101604081905261002f916100a3565b600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff831690811782556040518392907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a350506100de565b6000602082840312156100b4578081fd5b815173ffffffffffffffffffffffffffffffffffffffff811681146100d7578182fd5b9392505050565b611579806100ed6000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c80639456fbcc1161005b5780639456fbcc14610136578063bc197c8114610149578063f23a6e6114610169578063f2fde38b1461017c57610088565b806301ffc9a7146100c35780631fbe0e90146100ec5780637ecebe0014610101578063893d20e814610121575b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ba90611371565b60405180910390fd5b6100d66100d1366004610f61565b61018f565b6040516100e391906111c4565b60405180910390f35b6100ff6100fa366004610e93565b61022a565b005b61011461010f366004610c7f565b6103c5565b6040516100e39190611488565b6101296103dd565b6040516100e391906110e9565b6100ff610144366004610ca2565b6103f9565b61015c610157366004610cda565b6105eb565b6040516100e391906111cf565b61015c610177366004610dee565b610817565b6100ff61018a366004610c7f565b610906565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f01ffc9a700000000000000000000000000000000000000000000000000000000148061022257507fffffffff0000000000000000000000000000000000000000000000000000000082167f4e2312e000000000000000000000000000000000000000000000000000000000145b90505b919050565b73ffffffffffffffffffffffffffffffffffffffff86161580159061024f5750600085115b610285576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ba90611259565b3360009081526001602052604090205463ffffffff85811691161480156102b657508363ffffffff1663ffffffff14155b6102ec576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ba906112b7565b336000908152600160208190526040822080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000811663ffffffff9182169093011691909117905573ffffffffffffffffffffffffffffffffffffffff82166103555733610357565b815b905061036587333089610a17565b8463ffffffff168173ffffffffffffffffffffffffffffffffffffffff167fdeb9f591f8c6dc21c70e22dc9b4ffa4e028f04d1191e1ca68ba16d89946dd4df86866040516103b4929190611130565b60405180910390a350505050505050565b60016020526000908152604090205463ffffffff1681565b60005473ffffffffffffffffffffffffffffffffffffffff1690565b60005473ffffffffffffffffffffffffffffffffffffffff16331461044a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ba9061142b565b73ffffffffffffffffffffffffffffffffffffffff8216610497576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ba906113ce565b6040517f70a0823100000000000000000000000000000000000000000000000000000000815260009073ffffffffffffffffffffffffffffffffffffffff8316906370a08231906104ec9030906004016110e9565b60206040518083038186803b15801561050457600080fd5b505afa158015610518573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061053c9190611097565b6040517fa9059cbb00000000000000000000000000000000000000000000000000000000815290915073ffffffffffffffffffffffffffffffffffffffff83169063a9059cbb90610593908690859060040161110a565b602060405180830381600087803b1580156105ad57600080fd5b505af11580156105c1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105e59190610f41565b50505050565b60006105f5610be7565b828060200190518101906106099190610fa1565b805190915060009073ffffffffffffffffffffffffffffffffffffffff166106315786610634565b81515b60208084015173ffffffffffffffffffffffffffffffffffffffff8a166000908152600190925260409091205491925063ffffffff91821691161480156106895750816020015163ffffffff1663ffffffff14155b6106bf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ba90611314565b73ffffffffffffffffffffffffffffffffffffffff871660009081526001602081905260409182902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000811663ffffffff91821690930116919091179055517f20ec271b00000000000000000000000000000000000000000000000000000000815233906320ec271b9061075b9089908990600401611196565b600060405180830381600087803b15801561077557600080fd5b505af1158015610789573d6000803e3d6000fd5b50505050816020015163ffffffff168173ffffffffffffffffffffffffffffffffffffffff167fd2bdf645b5eae77bb6ab0abdff1562e99a18f22fd0c7476528ac47d26c42d25184604001516040516107e29190611183565b60405180910390a3507fbc197c8100000000000000000000000000000000000000000000000000000000979650505050505050565b60408051600180825281830190925260009160609190602080830190803683375050604080516001808252818301909252929350606092915060208083019080368337019050509050868260008151811061086e57fe5b602002602001018181525050858160008151811061088857fe5b6020026020010181815250506108d78989848489898080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506105eb92505050565b507ff23a6e61000000000000000000000000000000000000000000000000000000009998505050505050505050565b60005473ffffffffffffffffffffffffffffffffffffffff163314610957576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ba9061142b565b73ffffffffffffffffffffffffffffffffffffffff81166109a4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016100ba906111fc565b600080547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff83811691821780845560405192939116917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a350565b6040805173ffffffffffffffffffffffffffffffffffffffff85811660248301528481166044830152606480830185905283518084039091018152608490920183526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167f23b872dd0000000000000000000000000000000000000000000000000000000017815292518251600094606094938a169392918291908083835b60208310610af557805182527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe09092019160209182019101610ab8565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114610b57576040519150601f19603f3d011682016040523d82523d6000602084013e610b5c565b606091505b5091509150818015610b8a575080511580610b8a5750808060200190516020811015610b8757600080fd5b50515b610bdf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260318152602001806115136031913960400191505060405180910390fd5b505050505050565b6040805160608082018352600080835260208301529181019190915290565b8035610225816114db565b600082601f830112610c21578081fd5b8135610c34610c2f826114bd565b611499565b818152915060208083019084810181840286018201871015610c5557600080fd5b60005b84811015610c7457813584529282019290820190600101610c58565b505050505092915050565b600060208284031215610c90578081fd5b8135610c9b816114db565b9392505050565b60008060408385031215610cb4578081fd5b8235610cbf816114db565b91506020830135610ccf816114db565b809150509250929050565b600080600080600060a08688031215610cf1578081fd5b8535610cfc816114db565b9450602086810135610d0d816114db565b9450604087013567ffffffffffffffff80821115610d29578384fd5b610d358a838b01610c11565b95506060890135915080821115610d4a578384fd5b610d568a838b01610c11565b94506080890135915080821115610d6b578384fd5b818901915089601f830112610d7e578384fd5b813581811115610d8a57fe5b610dba847fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f84011601611499565b91508082528a84828501011115610dcf578485fd5b8084840185840137810190920192909252949793965091945092919050565b60008060008060008060a08789031215610e06578081fd5b8635610e11816114db565b95506020870135610e21816114db565b94506040870135935060608701359250608087013567ffffffffffffffff80821115610e4b578283fd5b818901915089601f830112610e5e578283fd5b813581811115610e6c578384fd5b8a6020828501011115610e7d578384fd5b6020830194508093505050509295509295509295565b60008060008060008060a08789031215610eab578182fd5b8635610eb6816114db565b9550602087013594506040870135610ecd81611500565b9350606087013567ffffffffffffffff80821115610ee9578384fd5b818901915089601f830112610efc578384fd5b813581811115610f0a578485fd5b8a60208083028501011115610f1d578485fd5b602083019550809450505050610f3560808801610c06565b90509295509295509295565b600060208284031215610f52578081fd5b81518015158114610c9b578182fd5b600060208284031215610f72578081fd5b81357fffffffff0000000000000000000000000000000000000000000000000000000081168114610c9b578182fd5b60006020808385031215610fb3578182fd5b825167ffffffffffffffff80821115610fca578384fd5b9084019060608287031215610fdd578384fd5b604051606081018181108382111715610ff257fe5b6040528251611000816114db565b81528284015161100f81611500565b81850152604083015182811115611024578586fd5b80840193505086601f840112611038578485fd5b82519150611048610c2f836114bd565b82815284810190848601868502860187018a1015611064578788fd5b8795505b84861015611086578051835260019590950194918601918601611068565b506040830152509695505050505050565b6000602082840312156110a8578081fd5b5051919050565b6000815180845260208085019450808401835b838110156110de578151875295820195908201906001016110c2565b509495945050505050565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b73ffffffffffffffffffffffffffffffffffffffff929092168252602082015260400190565b6000602082528260208301527f07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff831115611168578081fd5b60208302808560408501379190910160400190815292915050565b600060208252610c9b60208301846110af565b6000604082526111a960408301856110af565b82810360208401526111bb81856110af565b95945050505050565b901515815260200190565b7fffffffff0000000000000000000000000000000000000000000000000000000091909116815260200190565b6020808252602a908201527f4f776e61626c65237472616e736665724f776e6572736869703a20494e56414c60408201527f49445f4144445245535300000000000000000000000000000000000000000000606082015260800190565b602080825260409082018190527f4974656d507572636861736550726f78792370757263686173654974656d733a908201527f20494e56414c49445f5041594d454e545f544f4b454e5f4f525f414d4f554e54606082015260800190565b6020808252602e908201527f4974656d507572636861736550726f78792370757263686173654974656d733a60408201527f20494e56414c49445f4e4f4e4345000000000000000000000000000000000000606082015260800190565b60208082526037908201527f4974656d507572636861736550726f7879236f6e45524331313535426174636860408201527f52656365697665643a20494e56414c49445f4e4f4e4345000000000000000000606082015260800190565b60208082526027908201527f4974656d507572636861736550726f7879235f3a20554e535550504f5254454460408201527f5f4d4554484f4400000000000000000000000000000000000000000000000000606082015260800190565b60208082526032908201527f4974656d507572636861736550726f787923776974686472617745524332303a60408201527f20494e56414c49445f524543495049454e540000000000000000000000000000606082015260800190565b60208082526026908201527f4f776e61626c65236f6e6c794f776e65723a2053454e4445525f49535f4e4f5460408201527f5f4f574e45520000000000000000000000000000000000000000000000000000606082015260800190565b63ffffffff91909116815260200190565b60405181810167ffffffffffffffff811182821017156114b557fe5b604052919050565b600067ffffffffffffffff8211156114d157fe5b5060209081020190565b73ffffffffffffffffffffffffffffffffffffffff811681146114fd57600080fd5b50565b63ffffffff811681146114fd57600080fdfe5472616e7366657248656c7065723a3a7472616e7366657246726f6d3a207472616e7366657246726f6d206661696c6564a26469706673582212209b612d183454d8a74994e7ca88a6d311a9c115c005fec9c796d881d36787733464736f6c63430007040033";
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
        name?: undefined;
        outputs?: undefined;
    } | {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        stateMutability: string;
        type: string;
        inputs?: undefined;
        anonymous?: undefined;
        name?: undefined;
        outputs?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): ItemPurchaseProxyInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): ItemPurchaseProxy;
}
export {};