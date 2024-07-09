#!/bin/bash

bin_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

perl $bin_dir/hmmscan_multi.pl "$@"


