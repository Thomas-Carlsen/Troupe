cd compiler; make # maybe you need to run 'stack install alex happy' first
cd ..; yarn install
make rt
make test