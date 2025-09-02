{
  description = "CAB432-A2";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {inherit system;};
      nodejs = pkgs.nodejs_22;
    in {
      # -------------------
      # DevShell
      # -------------------
      devShells.default = pkgs.mkShell {
        packages = [
          pkgs.jq
          nodejs
          pkgs.nodePackages.npm
          pkgs.ffmpeg
          pkgs.awscli2
          pkgs.httpie
        ];

        shellHook = ''
          echo "Node.js $(node --version)"
          echo "Javascript project environment ready!"

          export EC2=ec2-3-27-155-125.ap-southeast-2.compute.amazonaws.com
        '';
      };
    });
}
