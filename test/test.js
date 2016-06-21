(function(){
    'use strict';
    var Promise = window.PromisePolyfill();

    QUnit.config.order = true;

    test('resolve-then', function(assert){
        var done = assert.async();

        new Promise(function(resolve, reject){
                resolve('resolve');
            }).then(function(v){
                ok(v === 'resolve');
                done();
            });
    });

    test('reject-then', function(assert){
        var done = assert.async();

        new Promise(function(resolve, reject){
                reject('reject');
            }).then(
                function(v){
                },
                function(v){
                    ok(v === 'reject');
                    done();
                });
    });

    test('reject-catch', function(assert){
        var done = assert.async();

        new Promise(function(resolve, reject){
                reject('reject');
            }).catch(function(v){
                ok(v === 'reject');
                done();
            });
    });

    test('reject-catch-then', function(assert){
        var done = assert.async(),
            done1 = assert.async();

        new Promise(function(resolve, reject){
                reject('reject');
            }).catch(function(v){
                return v;
            }).then(function(v){
                ok(v === 'reject', 'catch-then');
                done();
            });

        new Promise(function(resolve, reject){
                reject('reject');
            }).catch().then(
            function(){},
            function(v){
                ok(v === 'reject', 'noncatch-then');
                done1();
            });
    });

    test('asyncResolve-then', function(assert){
        var done = assert.async();

        new Promise(function(resolve, reject){
                setTimeout(function(){
                    resolve('resolve');
                }, 100);
            }).then(function(v){
                ok(v === 'resolve');
                done();
            });
    });

    test('asyncReject-then', function(assert){
        var done = assert.async();

        new Promise(function(resolve, reject){
                setTimeout(function(){
                    reject('reject');
                }, 100);
            }).then(
                function(v){
                },
                function(v){
                    ok(v === 'reject');
                    done();
                });
    });

    test('resolve-asyncThen', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                resolve('resolve');
            });

        setTimeout(function(){
            p.then(
                    function(v){
                        ok(v === 'resolve');
                        done();
                    });
        }, 100);
    });

    test('reject-asyncThen', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                reject('reject');
            });

        p.catch(function(){});

        setTimeout(function(){
            p.then(
                    null,
                    function(v){
                        ok(v === 'reject');
                        done();
                    });
        }, 100);
    });

    test('reject-asynCatch', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                reject('reject');
            });

        p.catch(function(){});

        setTimeout(function(){
            p.catch(function(v){
                    ok(v === 'reject');
                        done();
                });
        }, 100);

    });



    test('asyncResolve-asyncThen', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                setTimeout(function(){
                    resolve('resolve');
                }, 100);
            });

        setTimeout(function(){
            p.then(
                    function(v){
                        ok(v === 'resolve');
                        done();
                    });
        }, 100);
    });

    test('asyncReject-asyncThen', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                setTimeout(function(){
                    reject('reject');
                }, 100);
            });

        setTimeout(function(){
            p.then(
                    null,
                    function(v){
                        ok(v === 'reject');
                        done();
                    });
        }, 100);
    });

    test('asyncReject-asynCatch', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                setTimeout(function(){
                    reject('reject');
                }, 100);
            });

        setTimeout(function(){
            p.catch(function(v){
                    ok(v === 'reject');
                        done();
                });
        }, 100);
    });

    test('resolve-then-catch', function(assert){
        var result = 0;
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                resolve('resolve');
            })
            .then(function(v){
                    result = 1;
                })
            .catch(function(v){
                result = 2;
            });

        setTimeout(function(){
            ok(result === 1);
            done();
        }, 0);
    });

    test('resolve-then-then', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                resolve('resolve');
            })
            .then(function(v){
                    return '2nd-resolve';
                })
            .then(function(v){
                ok(v === '2nd-resolve');
                done();
            });
    });

    test('reject-nullthen-catch', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                reject('reject');
            })
            .then(function(v){})
            .catch(function(v){
                ok(v === 'reject');
                done();
            });
    });

    test('reject-then-catch', function(assert){
        var done = assert.async();

        var result = 0;

        var p = new Promise(function(resolve, reject){
                reject('reject');
            })
            .then(
                function(v){},
                function(v){
                    result = 1;
                })
            .catch(function(v){
                result = 2;
            });

        setTimeout(function(){
            ok(result === 1);
            done();
        }, 100);
    });

    test('reject-then-then', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                reject('reject');
            })
            .then(
                function(v){},
                function(v){
                    return v;
                })
            .then(function(v){
                ok(v === 'reject');
                done();
            });
    });

    test('reject-nullthen-then', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                reject('reject');
            })
            .then(function(v){})
            .then(
                function(v){},
                function(v){
                    ok(v === 'reject');
                    done();
                });
    });


    test('all-string', function(assert){
        var done = assert.async();

        Promise.all('abcdefg').then(function(v){
            ok(v.join('') === 'abcdefg');
            done();
        });
    });

    test('all-literal-array', function(assert){
        var done = assert.async();

        Promise.all([1,2,3,4,5]).then(function(v){
            ok(v.join('') === '12345');
            done();
        });
    });

    test('all-syncResolved-promise-array', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                resolve(1);
            }),
            p1 = new Promise(function(resolve, reject){
                resolve(2);
            });

        Promise.all([p, 3,4,5, p1]).then(function(v){
            ok(v.join('') === '13452');
            done();
        });
    });

    test('all-asyncResolved-promise-array', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                setTimeout(function(){
                    resolve(1);
                }, 100);
            }),
            p1 = new Promise(function(resolve, reject){
                setTimeout(function(){
                    resolve(2);
                }, 200);
            });

        Promise.all([p, 3,4,5, p1]).then(function(v){
            ok(v.join('') === '13452');
            done();
        });
    });

    test('all-rejected-promise-array', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                resolve(1);
            }),
            p1 = new Promise(function(resolve, reject){
                reject(2);
            });

        //p1.catch(function(){});

        Promise.all([p, 3,4,5, p1]).then(
            function(v){},
            function(v){
                ok(v === 2);
                done();
            });
    });

    test('all-rejected-catch-promise-array', function(assert){
        var done = assert.async();

        var p = new Promise(function(resolve, reject){
                resolve(1);
            }),
            p1 = new Promise(function(resolve, reject){
                reject(2);
            });

        //p1.catch(function(){});

        Promise.all([p, 3,4,5, p1]).catch(
            function(v){
                ok(v === 2);
                done();
            });
    });


    test('race-string', function(assert){
        var done = assert.async();

        Promise.race('abcdefg').then(function(v){
            ok(v === 'a');
            done();
        });
    });

    test('race-literal-array', function(assert){
        var done = assert.async();

        Promise.race([1,2,3,4,5]).then(function(v){
            ok(v === 1);
            done();
        });
    });

    test('race-reject-promise', function(assert){
        var done = assert.async(),
            done1 = assert.async(),
            done2 = assert.async(),
            done3 = assert.async(),
            done4 = assert.async();

        var p = new Promise(function(resolve, reject){
                reject('reject');
            });

        //p.catch(function(){});

        Promise.race([p, 1,2,3,4,5]).then(
            function(v){
                //ok(v === 1);
            },
            function(v){
                ok(v === 'reject', 'then-reject');
                done();
            }
        );

        var p1 = new Promise(function(resolve, reject){
                reject('reject');
            });

        //p1.catch(function(){});

        Promise.race([p1, 1,2,3,4,5]).catch(
            function(v){
                ok(v === 'reject', 'catch-reject');
                done1();
            }
        );

        var p2 = new Promise(function(resolve, reject){
                reject('reject');
            });

        //p2.catch(function(){});

        Promise.race([p2, 1,2,3,4,5])
            .then()
            .catch(function(v){
                ok(v === 'reject', 'unrejected-then-catch-reject');
                done2();
            });

        var p3 = new Promise(function(resolve, reject){
                reject('reject');
            });

        //p3.catch(function(){});

        Promise.race([1, p3, 2,3,4,5]).then(
            function(v){
                ok(v === 1, 'literal-rejected-promise-order');
                done3();
            }
        );

        var p4 = new Promise(function(resolve, reject){
                resolve('reject');
            });

        Promise.race([1, p4, 2,3,4,5]).then(
            function(v){
                ok(v === 1, 'literal-resolved-promise-order');
                done4();
            }
        );
    });

    test('race-reject-promise-async', function(assert){
        var done = assert.async(),
            done1 = assert.async(),
            done2 = assert.async();


        var p = new Promise(function(resolve, reject){
                setTimeout(function(){
                    resolve('p-resolve');
                }, 250);
            });

        var p1 = new Promise(function(resolve, reject){
                setTimeout(function(){
                    reject('p1-reject');
                }, 200);
            });

        var p2 = new Promise(function(resolve, reject){
                setTimeout(function(){
                    resolve('p2-resolve');
                }, 150);
            });

        var p3 = new Promise(function(resolve, reject){
                setTimeout(function(){
                    reject('p3-reject');
                }, 100);
            });

        var p4 = new Promise(function(resolve, reject){
                setTimeout(function(){
                    resolve('p4-resolve');
                }, 50);
            });

        Promise.race([p, p1, p2, p3, p4]).then(
            function(v){
                ok(v === 'p4-resolve', '--p4-resolved-50ms-fastest');
                done();
            }
        );

        Promise.race([p, p1, p2, p3]).then(
            function(v){
                alert(v);
            },
            function(v){
                ok(v === 'p3-reject', 'p3-reject-100ms-fastest');
                done1();
            }
        );

        Promise.race([p, p1, p2, p3, 5]).then(
            function(v){
                ok(v === 5, 'literal-fastest');
                done2();
            }
        );
    });

    test('cascaded-promises', function(assert){
        var done = assert.async(),
            done1 = assert.async(),
            done2 = assert.async(),
            done3 = assert.async(),
            done4 = assert.async(),
            done5 = assert.async(),
            done6 = assert.async(),
            done7 = assert.async();

        new Promise(function(resolve, reject){
            resolve();
        }).then(function(){
            return new Promise(function(resolve, reject){
                resolve('111111');
            });
        }).then(function(v){
            ok(v === '111111', 'sync');
            done();
        });


        new Promise(function(resolve, reject){
             setTimeout(function(){
                  resolve();
             }, 10);
        }).then(function(){
             return new Promise(function(resolve, reject){
                 setTimeout(function(){
                      resolve('111111');
                 }, 10);
             });
        }).then(function(v){
            ok(v === '111111', 'async');
            done1();
        });

        new Promise(function(resolve, reject){
             setTimeout(function(){
                  resolve();
             }, 10);
        }).then(function(){
             return new Promise(function(resolve, reject){
                  resolve('111111');
             });
        }).then(function(v){
            ok(v === '111111', 'sync-async');
            done2();
        });

        new Promise(function(resolve, reject){
            resolve();
        }).then(function(){
             return new Promise(function(resolve, reject){
                 setTimeout(function(){
                      resolve('111111');
                 }, 10);
             });
        }).then(function(v){
            ok(v === '111111', 'async-sync');
            done3();
        });


        new Promise(function(resolve, reject){
            resolve();
        }).then(function(){
             return new Promise(function(resolve, reject){
                 setTimeout(function(){
                      reject('222222');
                 }, 10);
             });
        }).then(null, function(v){
            ok(v === '222222', 'reject-async');
            done4();
        });

        new Promise(function(resolve, reject){
            resolve();
        }).then(function(){
             return new Promise(function(resolve, reject){
                reject('222222');
             });
        }).then(null, function(v){
            ok(v === '222222', 'reject-sync');
            done5();
        });

        new Promise(function(resolve, reject){
            resolve();
        }).then(function(){
             return new Promise(function(resolve, reject){
                reject('333333');
             });
        }).catch(function(v){
            ok(v === '333333', 'catch-reject-sync');
            done6();
        });

        new Promise(function(resolve, reject){
            resolve();
        }).then(function(){
             return new Promise(function(resolve, reject){
                 setTimeout(function(){
                    reject('333333');
                },10);
             });
        }).catch(function(v){
            ok(v === '333333', 'catch-reject-async');
            done7();
        });
    });
}());
