cd compiler; make # maybe we need to run 'stack install alex happy'
cd ..; yarn install
make rt
make test