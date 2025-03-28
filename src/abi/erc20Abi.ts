export const ERC20_ABI = [
  'function name() view returns (string)',
  'function approve(address _spender, uint256 _value) returns (bool)',
  'function totalSupply() view returns (uint256)',
  'function transferFrom(address _from, address _to, uint256 _value) returns (bool)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address _owner) view returns (uint256 balance)',
  'function symbol() view returns (string)',
  'function transfer(address _to, uint256 _value) returns (bool)',
  'function allowance(address _owner, address _spender) view returns (uint256)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
];
